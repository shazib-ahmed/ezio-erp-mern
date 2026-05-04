import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/shared/lib/axios';
import { Industry, IndustryState } from '../types/industry.types';

const initialState: IndustryState = {
  industries: [],
  loading: false,
  isSubmitting: false,
  error: null,
  nextCursor: null,
  hasMore: true,
};

export const fetchIndustries = createAsyncThunk(
  'industry/fetchIndustries',
  async (cursor: number | undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get('/industries', {
        params: { limit: 12, cursor }
      });
      return response.data; // { data, nextCursor }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch industries');
    }
  }
);

export const createIndustry = createAsyncThunk(
  'industry/createIndustry',
  async (data: Partial<Industry>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/industries', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create industry');
    }
  }
);

export const updateIndustry = createAsyncThunk(
  'industry/updateIndustry',
  async ({ id, data }: { id: string; data: Partial<Industry> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/industries/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update industry');
    }
  }
);

export const deleteIndustry = createAsyncThunk(
  'industry/deleteIndustry',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/industries/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete industry');
    }
  }
);

const industrySlice = createSlice({
  name: 'industry',
  initialState,
  reducers: {
    resetIndustryState: (state) => {
      state.industries = [];
      state.nextCursor = null;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchIndustries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action: PayloadAction<{ data: Industry[]; nextCursor: number | null }>) => {
        state.loading = false;
        const { data, nextCursor } = action.payload;
        
        if (state.nextCursor === null) {
          state.industries = data;
        } else {
          const existingIds = new Set(state.industries.map(i => i.id));
          const newItems = data.filter((i: Industry) => !existingIds.has(i.id));
          state.industries = [...state.industries, ...newItems];
        }
        
        state.nextCursor = nextCursor;
        state.hasMore = !!nextCursor;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createIndustry.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createIndustry.fulfilled, (state, action: PayloadAction<Industry>) => {
        state.isSubmitting = false;
        state.industries.push(action.payload);
      })
      .addCase(createIndustry.rejected, (state) => {
        state.isSubmitting = false;
      })
      // Update
      .addCase(updateIndustry.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateIndustry.fulfilled, (state, action: PayloadAction<Industry>) => {
        state.isSubmitting = false;
        const index = state.industries.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.industries[index] = action.payload;
        }
      })
      .addCase(updateIndustry.rejected, (state) => {
        state.isSubmitting = false;
      })
      // Delete
      .addCase(deleteIndustry.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(deleteIndustry.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSubmitting = false;
        state.industries = state.industries.filter(i => i.id !== action.payload);
      })
      .addCase(deleteIndustry.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export const { resetIndustryState } = industrySlice.actions;
export default industrySlice.reducer;
