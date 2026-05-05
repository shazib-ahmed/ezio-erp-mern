import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/shared/lib/axios';

export interface Brand {
  id: number;
  name: string;
  logo: string | null;
  _count?: {
    products: number;
  };
  createdAt: string;
}

interface BrandState {
  brands: Brand[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  nextCursor: number | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  isSubmitting: false,
  error: null,
  nextCursor: null,
};

export const fetchBrands = createAsyncThunk(
  'brand/fetchAll',
  async (params: { search?: string; limit?: number; cursor?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get('/inventory/brands', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

export const createBrand = createAsyncThunk(
  'brand/create',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/inventory/brands', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brand/update',
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/inventory/brands/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brand/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/inventory/brands/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete brand');
    }
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.loading = true;
        // Only clear if it's not a "load more" (pagination) request
        if (!action.meta.arg?.cursor) {
          state.brands = [];
          state.nextCursor = null;
        }
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.data || [];
        if (action.meta.arg?.cursor) {
          state.brands = [...state.brands, ...newData];
        } else {
          state.brands = newData;
        }
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.unshift(action.payload);
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.brands = state.brands.filter(b => b.id !== action.payload);
      })
      .addMatcher(
        (action) => [createBrand.pending.type, updateBrand.pending.type, deleteBrand.pending.type].includes(action.type),
        (state) => { state.isSubmitting = true; }
      )
      .addMatcher(
        (action) => [createBrand.fulfilled.type, updateBrand.fulfilled.type, createBrand.rejected.type, updateBrand.rejected.type, deleteBrand.rejected.type].includes(action.type),
        (state) => { state.isSubmitting = false; }
      );
  },
});

export default brandSlice.reducer;
