import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesService } from '../services/salesService';
import { inventoryService } from '@/modules/inventory/services/inventoryService';
import { toast } from 'sonner';

interface SalesState {
  products: any[];
  customers: any[];
  salesHistory: any[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: SalesState = {
  products: [],
  customers: [],
  salesHistory: [],
  loading: false,
  isSubmitting: false,
  error: null,
};

export const fetchPOSData = createAsyncThunk(
  'sales/fetchPOSData',
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, customersRes] = await Promise.all([
        inventoryService.getProducts({ limit: 100 }),
        salesService.getCustomers(),
      ]);
      
      return {
        products: productsRes.data, // inventoryService returns { data, nextCursor }
        customers: customersRes.data, // salesService returns { success, data, message }.data
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch POS data');
    }
  }
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData: any, { rejectWithValue }) => {
    try {
      const response = await salesService.createSale(saleData);
      toast.success('Sale completed successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to complete sale';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchSalesHistory = createAsyncThunk(
  'sales/fetchSalesHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesService.getSales();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales history');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPOSData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOSData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.customers = action.payload.customers;
      })
      .addCase(fetchPOSData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSale.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createSale.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createSale.rejected, (state) => {
        state.isSubmitting = false;
      })
      .addCase(fetchSalesHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.salesHistory = action.payload;
      })
      .addCase(fetchSalesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = salesSlice.actions;
export default salesSlice.reducer;
