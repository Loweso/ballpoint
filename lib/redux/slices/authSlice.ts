import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_DEVICE_IPV4}`;

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
      passwordConfirmation,
    }: {
      username: string;
      email: string;
      password: string;
      passwordConfirmation: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/register", {
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/login", { email, password });
      const { access, refresh } = response.data;

      await Promise.all([
        SecureStore.setItemAsync("access_token", access),
        SecureStore.setItemAsync("refresh_token", refresh),
      ]);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/api/google", {
        id_token: idToken,
      });

      const { access, refresh } = response.data;

      // Save tokens securely
      await Promise.all([
        SecureStore.setItemAsync("access_token", access),
        SecureStore.setItemAsync("refresh_token", refresh),
      ]);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Google login failed" }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/logout");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    } finally {
      await clearAuthTokens();
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/api/refresh", {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      await SecureStore.setItemAsync("access_token", newAccessToken);

      return newAccessToken;
    } catch (error: any) {
      await clearAuthTokens();
      // Return only serializable error data
      return rejectWithValue(
        error.response?.data || { message: "Token refresh failed" }
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { dispatch }) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const storedRefreshToken = await SecureStore.getItemAsync(
        "refresh_token"
      );

      if (!accessToken || !storedRefreshToken) {
        return false;
      }

      // Try to refresh the token to ensure it's valid
      await dispatch(refreshToken()).unwrap();
      return true;
    } catch (error) {
      await clearAuthTokens();
      return false;
    }
  }
);

export const clearAuthTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync("access_token"),
    SecureStore.deleteItemAsync("refresh_token"),
  ]);
};

const getRefreshToken = async () =>
  await SecureStore.getItemAsync("refresh_token");

const saveTokens = async ({
  access,
  refresh,
}: {
  access: string;
  refresh: string;
}) => {
  await Promise.all([
    SecureStore.setItemAsync("access_token", access),
    SecureStore.setItemAsync("refresh_token", refresh),
  ]);
};
// Configure axios interceptors
api.interceptors.request.use(async (config) => {
  const unauthenticatedPaths = ["/api/login", "/api/register", "/api/google"];

  if (!unauthenticatedPaths.includes(config.url!)) {
    const accessToken = await SecureStore.getItemAsync("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

let isRefreshing = false;
let requestQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null) => {
  requestQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  requestQueue = [];
};

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;

  const publicEndpoints = [
    "/api/login",
    "/api/register",
    "/api/google",
    "/api/refresh",
  ];

  return publicEndpoints.some((endpoint) => url.includes(endpoint));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if not 401 or already retried or public endpoint
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isPublicEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      await clearAuthTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await api.post("/api/user/token/refresh/", {
        refresh: refreshTokenValue,
      });

      const { access, refresh } = response.data;
      saveTokens({ access, refresh });

      processQueue(null, access);

      originalRequest.headers.Authorization = `Bearer ${access}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await clearAuthTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to check auth status
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
export { api };
