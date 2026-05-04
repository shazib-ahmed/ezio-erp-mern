import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/shared/lib/axios';
import { TenantsState } from '../types/tenants.types';

const initialState: TenantsState = {
  tenants: [],
  currentTenant: null,
  loading: false,
  error: null,
  stats: null,
};

export const fetchTenants = createAsyncThunk(
  'tenants/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/tenants');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenants');
    }
  }
);

export const fetchTenantStats = createAsyncThunk(
  'tenants/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/tenants/stats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchTenantById = createAsyncThunk(
  'tenants/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/admin/tenants/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenant details');
    }
  }
);

const tenantsSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    clearTenantError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Stats
      .addCase(fetchTenantStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Fetch By Id
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.currentTenant = action.payload;
      });
  },
});

export const { clearTenantError } = tenantsSlice.actions;
export default tenantsSlice.reducer;
