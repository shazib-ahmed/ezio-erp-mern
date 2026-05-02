import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/shared/lib/axios';
import { Industry, IndustryState } from '../types/industry.types';

const initialState: IndustryState = {
  industries: [],
  loading: false,
  error: null,
};

export const fetchIndustries = createAsyncThunk(
  'industry/fetchIndustries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/industries');
      return response.data.data;
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchIndustries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action: PayloadAction<Industry[]>) => {
        state.loading = false;
        state.industries = action.payload;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createIndustry.fulfilled, (state, action: PayloadAction<Industry>) => {
        state.industries.push(action.payload);
      })
      // Update
      .addCase(updateIndustry.fulfilled, (state, action: PayloadAction<Industry>) => {
        const index = state.industries.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.industries[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteIndustry.fulfilled, (state, action: PayloadAction<string>) => {
        state.industries = state.industries.filter(i => i.id !== action.payload);
      });
  },
});

export default industrySlice.reducer;
