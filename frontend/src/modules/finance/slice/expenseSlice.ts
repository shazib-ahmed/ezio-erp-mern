import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeService } from '../services/financeService';

interface ExpenseState {
  expenses: any[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  nextCursor: number | null;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  isSubmitting: false,
  error: null,
  nextCursor: null,
};

export const fetchExpenses = createAsyncThunk(
  'expense/fetchAll',
  async (params: { search?: string; limit?: number; cursor?: number; category?: string; accountId?: number } | undefined, { rejectWithValue }) => {
    try {
      return await financeService.getExpenses(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'finance/createExpense',
  async (data: any, { rejectWithValue }) => {
    try {
      return await financeService.createExpense(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'finance/updateExpense',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      return await financeService.updateExpense(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'finance/deleteExpense',
  async (id: number, { rejectWithValue }) => {
    try {
      await financeService.deleteExpense(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (!action.meta.arg?.cursor) {
          state.expenses = [];
          state.nextCursor = null;
        }
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        console.log('fetchExpenses payload:', payload);
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
          state.expenses = [...(state.expenses || []), ...newData];
        } else {
          state.expenses = newData;
        }
        state.nextCursor = nextCursor;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        const newExpense = action.payload.data || action.payload;
        if (Array.isArray(state.expenses)) {
          state.expenses.unshift(newExpense);
        } else {
          state.expenses = [newExpense];
        }
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const updatedData = action.payload.data || action.payload;
        const index = state.expenses.findIndex(e => e.id === updatedData.id);
        if (index !== -1) {
          state.expenses[index] = updatedData;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      })
      .addMatcher(
        (action) => [createExpense.pending.type, updateExpense.pending.type].includes(action.type),
        (state) => { state.isSubmitting = true; }
      )
      .addMatcher(
        (action) => [
          createExpense.fulfilled.type, 
          updateExpense.fulfilled.type, 
          createExpense.rejected.type, 
          updateExpense.rejected.type
        ].includes(action.type),
        (state) => { state.isSubmitting = false; }
      );
  },
});

export default expenseSlice.reducer;
