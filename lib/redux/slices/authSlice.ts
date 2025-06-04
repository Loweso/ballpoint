import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { RootState } from "../store";

const API_URL = `${process.env.EXPO_PUBLIC_DEVICE_IPV4}`;

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface AuthError {
  message?: string;
  non_field_errors?: string[];
  username?: string[];
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
}

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
      const errorData = error.response?.data as AuthError;
      return rejectWithValue(errorData || { message: "Registration failed" });
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
      // Clear any existing tokens on login failure
      await clearAuthTokens();
      const errorData = error.response?.data as AuthError;
      return rejectWithValue(errorData || { message: "Login failed" });
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
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Clear Redux state immediately
      dispatch(authSlice.actions.clearAuthState());

      // Clear tokens from SecureStore
      await clearAuthTokens();

      // Call logout endpoint
      await api.post("/api/logout");

      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
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

export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken;

      const response = await api.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user data" }
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

      // Fetch user data after successful token refresh
      const userData = await dispatch(getUserData()).unwrap();

      return { isAuthenticated: true, userData };
    } catch (error) {
      await clearAuthTokens();
      return { isAuthenticated: false, userData: null };
    }
  }
);

export const clearAuthTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync("access_token"),
    SecureStore.deleteItemAsync("refresh_token"),
  ]);
};

export const updateUsername = createAsyncThunk(
  "auth/updateUsername",
  async ({ username }: { username: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken;

      const response = await api.patch(
        "/api/update-username",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update username" }
      );
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "auth/updateProfilePicture",
  async ({ photo }: { photo: any }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken;

      const formData = new FormData();

      const file = {
        uri: photo.uri,
        name: photo.name || "profile.jpg",
        type: photo.type || "image/jpeg",
      };

      formData.append("photo", file as any);

      const response = await api.post("api/profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // Expecting { photo: 'url' }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Profile picture update failed" }
      );
    }
  }
);

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
    if (!error.response) {
      // Network error
      return Promise.reject({
        message: "Network error. Please check your connection.",
      });
    }

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
  error: AuthError | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false, // Start with loading true to check auth status
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
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
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.userData) {
          state.user = action.payload.userData;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
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
        state.error = action.payload as AuthError;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Clear any existing auth state when starting a new login attempt
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as AuthError;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        // State is already cleared by clearAuthState action
      })
      .addCase(logoutUser.rejected, (state) => {
        // Ensure state is cleared even if logout fails
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
        state.error = action.payload as AuthError;
      })
      // Update username
      .addCase(updateUsername.fulfilled, (state, action) => {
        if (state.user) {
          state.user.username = action.payload.username;
        }
      })
      // Update Profile Picture
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profile_picture = action.payload.profile_picture;
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.error = action.payload as AuthError;
      });
  },
});

export const { clearError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
export { api };
