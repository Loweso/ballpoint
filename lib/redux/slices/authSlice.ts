import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/api`;

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
      const response = await api.post("/register", {
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
      const response = await api.post("/login", { email, password });
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

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
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

      const response = await api.post("/refresh", {
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

const clearAuthTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync("access_token"),
    SecureStore.deleteItemAsync("refresh_token"),
  ]);
};

// Configure axios interceptors
api.interceptors.request.use(async (config) => {
  const unauthenticatedPaths = ["/login", "/register"];

  if (!unauthenticatedPaths.includes(config.url!)) {
    const accessToken = await SecureStore.getItemAsync("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await clearAuthTokens();
        throw error;
      }
    }

    return Promise.reject(error);
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
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
