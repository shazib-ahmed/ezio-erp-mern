import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/shared/lib/axios';

export interface Category {
  id: number;
  name: string;
  _count?: {
    products: number;
  };
  createdAt: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  nextCursor: number | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  isSubmitting: false,
  error: null,
  nextCursor: null,
};

export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (params: { search?: string; limit?: number; cursor?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get('/inventory/categories', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/create',
  async (data: { name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/inventory/categories', data);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, data }: { id: number; data: { name: string } }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/inventory/categories/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/inventory/categories/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.loading = true;
        // Only clear if it's not a "load more" (pagination) request
        if (!action.meta.arg?.cursor) {
          state.categories = [];
          state.nextCursor = null;
        }
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.data || [];
        if (action.meta.arg?.cursor) {
          state.categories = [...state.categories, ...newData];
        } else {
          state.categories = newData;
        }
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      .addMatcher(
        (action) => [createCategory.pending.type, updateCategory.pending.type, deleteCategory.pending.type].includes(action.type),
        (state) => { state.isSubmitting = true; }
      )
      .addMatcher(
        (action) => [createCategory.fulfilled.type, updateCategory.fulfilled.type, deleteCategory.fulfilled.type, createCategory.rejected.type, updateCategory.rejected.type, deleteCategory.rejected.type].includes(action.type),
        (state) => { state.isSubmitting = false; }
      );
  },
});

export default categorySlice.reducer;
