import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/shared/lib/axios';
import { AuthState, User } from '../types/auth.types';
import { saveSecureData, getSecureData, removeSecureData } from '@/shared/lib/storage';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  isInitializing: true,
  isSubmitting: false,
  error: null,
};

// Initialize auth from secure storage
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const user = await getSecureData('auth_user');
      const accessToken = await getSecureData('auth_accessToken');
      const refreshToken = await getSecureData('auth_refreshToken');

      if (accessToken && user) {
        // Fetch latest profile in background to hydrate state with fresh DB data
        dispatch(fetchMe());
        return { user, accessToken, refreshToken };
      }
      return null;
    } catch (error) {
      return rejectWithValue('Initialization failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data.data;
      
      // Save to Encrypted IndexedDB
      await saveSecureData('auth_user', user);
      await saveSecureData('auth_accessToken', accessToken);
      await saveSecureData('auth_refreshToken', refreshToken);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/signup', data);
      const { user, accessToken, refreshToken } = response.data.data;
      
      // Save to Encrypted IndexedDB
      await saveSecureData('auth_user', user);
      await saveSecureData('auth_accessToken', accessToken);
      await saveSecureData('auth_refreshToken', refreshToken);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const response = await axios.post('/auth/refresh', {
        userId: state.auth.user?.id,
        refreshToken: state.auth.refreshToken,
      });
      
      const { accessToken, refreshToken } = response.data.data;
      
      await saveSecureData('auth_accessToken', accessToken);
      await saveSecureData('auth_refreshToken', refreshToken);
      
      return { accessToken, refreshToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.post('/auth/logout');
      dispatch(logout()); // Clear local state
      return null;
    } catch (error: any) {
      // Even if API fails, we should clear local state for safety
      dispatch(logout());
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.patch('/account/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const user = response.data.data;
      
      // Update secure storage
      await saveSecureData('auth_user', user);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const updateTenantInfo = createAsyncThunk<User, any>(
  'auth/updateTenant',
  async (data: any, { getState, rejectWithValue }) => {
    try {
      const response = await axios.patch('/account/tenant', data);
      const tenant = response.data.data;
      
      const state = getState() as { auth: AuthState };
      if (!state.auth.user) throw new Error('User not found');

      const updatedUser = { 
        ...state.auth.user, 
        tenant: {
          ...state.auth.user.tenant,
          ...tenant
        }
      };
      
      // Update secure storage
      await saveSecureData('auth_user', updatedUser);
      
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Business update failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/auth/me');
      const user = response.data.data;
      await saveSecureData('auth_user', user);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.isInitializing = false;
      state.isSubmitting = false;
      removeSecureData('auth_user');
      removeSecureData('auth_accessToken');
      removeSecureData('auth_refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitializing = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitializing = false;
      })
      .addCase(login.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isSubmitting = false;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refresh.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        removeSecureData('auth_user');
        removeSecureData('auth_accessToken');
        removeSecureData('auth_refreshToken');
      })
      .addCase(updateProfile.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateTenantInfo.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateTenantInfo.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
      })
      .addCase(updateTenantInfo.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
