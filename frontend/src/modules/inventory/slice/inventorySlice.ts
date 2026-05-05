import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, InventoryStats } from '../types';
import { inventoryService } from '../services/inventoryService';

interface InventoryState {
  products: Product[];
  stats: InventoryStats | null;
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  nextCursor: number | null;
}

const initialState: InventoryState = {
  products: [],
  stats: null,
  loading: false,
  isSubmitting: false,
  error: null,
  nextCursor: null,
};

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (params: { search?: string; limit?: number; cursor?: number } | undefined, { rejectWithValue }) => {
    try {
      return await inventoryService.getProducts(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchInventoryStats = createAsyncThunk(
  'inventory/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const addProduct = createAsyncThunk(
  'inventory/addProduct',
  async (data: Partial<Product>, { rejectWithValue }) => {
    try {
      return await inventoryService.createProduct(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct',
  async ({ id, data }: { id: number; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      return await inventoryService.updateProduct(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await inventoryService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Only clear if it's not a "load more" (pagination) request
        if (!action.meta.arg?.cursor) {
          state.products = [];
          state.nextCursor = null;
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newData = action.payload.data || [];
        if (action.meta.arg?.cursor) {
          state.products = [...state.products, ...newData];
        } else {
          state.products = newData;
        }
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Stats
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Add Product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addMatcher(
        (action) => [addProduct.pending.type, updateProduct.pending.type].includes(action.type),
        (state) => { state.isSubmitting = true; }
      )
      .addMatcher(
        (action) => [addProduct.fulfilled.type, updateProduct.fulfilled.type, addProduct.rejected.type, updateProduct.rejected.type].includes(action.type),
        (state) => { state.isSubmitting = false; }
      );
  },
});

export default inventorySlice.reducer;
