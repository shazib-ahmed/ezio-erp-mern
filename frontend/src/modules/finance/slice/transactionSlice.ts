import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeService } from '../services/financeService';

interface TransactionState {
  transactions: any[];
  stats: { totalIncome: number; totalExpense: number; netBalance: number } | null;
  loading: boolean;
  error: string | null;
  nextCursor: number | null;
}

const initialState: TransactionState = {
  transactions: [],
  stats: null,
  loading: false,
  error: null,
  nextCursor: null,
};

export const fetchTransactions = createAsyncThunk(
  'finance/fetchTransactions',
  async (params: { search?: string; limit?: number; cursor?: number; type?: string; method?: string; accountId?: number } | undefined, { rejectWithValue }) => {
    try {
      return await financeService.getTransactions(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchFinanceStats = createAsyncThunk(
  'finance/fetchFinanceStats',
  async (_, { rejectWithValue }) => {
    try {
      return await financeService.getStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (!action.meta.arg?.cursor) {
          state.transactions = [];
          state.nextCursor = null;
        }
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        let newData = [];
        let nextCursor = null;

        if (payload?.data && Array.isArray(payload.data.data)) {
          newData = payload.data.data;
          nextCursor = payload.data.nextCursor;
        } else if (Array.isArray(payload?.data)) {
          newData = payload.data;
          nextCursor = payload.nextCursor;
        } else if (Array.isArray(payload)) {
          newData = payload;
        }

        if (action.meta.arg?.cursor) {
          state.transactions = [...state.transactions, ...newData];
        } else {
          state.transactions = newData;
        }
        state.nextCursor = nextCursor;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFinanceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default transactionSlice.reducer;
