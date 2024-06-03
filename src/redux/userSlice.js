import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance"


const initialState = {
  user: localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken")).user : null,
  accessToken: localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken")).accessToken : null,
  refreshToken: localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken")).refreshToken : null,
  isLoading: false,
  error: null,
};

export const loadUserFromLocalStorage = createAsyncThunk(
  "user/loadUserFromLocalStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken')).refreshToken;
      if (!token) return rejectWithValue("No token found");

      const response = await axiosInstance.get(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      return user;
    } catch (error) {
      return rejectWithValue("Failed to load user from localStorage");
    }
  }
);

// Refresh token thunk
export const refreshTokens = createAsyncThunk(
  "user/refreshTokens",
  async (_, { rejectWithValue }) => {
    const { refreshToken } = JSON.parse(localStorage.getItem('userToken'));
    try {
      const response = await axiosInstance.post(`/api/auth/refresh-token`, { token: refreshToken });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to refresh token");
      return rejectWithValue("Failed to refresh token");
    }
  }
);

// Async thunk for user sign up
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async ({ email, password, confirmPassword, firstName, lastName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/auth/sign-up`, {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("Sign Up Error: ", error);
      return rejectWithValue("Failed to sign up")
    }
  }
);

// Async thunk for user sign in
export const signInUser = createAsyncThunk(
  "user/signInUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/auth/sign-in`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("Sign In Error: ", error);
      return rejectWithValue("Failed to sign in")
    }
  }
);

// Reset password thunk
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({email, newPassword}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/auth/reset-password`, {
        email,
        newPassword,
      });
      toast.success("Password Reset!")
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("Reset Password Error: ", error);
      return rejectWithValue("Failed to reset password")
    }
  }
)


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("userToken");
      window.location.href = "/";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.result;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("userToken", JSON.stringify({ user: action.payload.result, accessToken: action.payload.accessToken, refreshToken: action.payload.refreshToken }));
        window.location.href = "/";
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.result;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("userToken", JSON.stringify({ user: action.payload.result, accessToken: action.payload.accessToken, refreshToken: action.payload.refreshToken }));
        window.location.href = "/";
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("userToken", JSON.stringify({ ...state, accessToken: action.payload.accessToken }));
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem("userToken");
        window.location.href = "/";
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        window.location.href = "/login";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
