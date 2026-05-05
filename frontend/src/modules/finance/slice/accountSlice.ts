import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeService } from '../services/financeService';

interface AccountState {
  accounts: any[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  nextCursor: number | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  isSubmitting: false,
  error: null,
  nextCursor: null,
};

export const fetchAccounts = createAsyncThunk(
  'finance/fetchAccounts',
  async (params: { search?: string; limit?: number; cursor?: number } | undefined, { rejectWithValue }) => {
    try {
      return await financeService.getAccounts(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts');
    }
  }
);

export const createAccount = createAsyncThunk(
  'finance/createAccount',
  async (data: any, { rejectWithValue }) => {
    try {
      return await financeService.createAccount(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create account');
    }
  }
);

export const updateAccount = createAsyncThunk(
  'finance/updateAccount',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      return await financeService.updateAccount(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update account');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'finance/deleteAccount',
  async (id: number, { rejectWithValue }) => {
    try {
      await financeService.deleteAccount(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (!action.meta.arg?.cursor) {
          state.accounts = [];
          state.nextCursor = null;
        }
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        console.log('fetchAccounts payload:', payload);
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
          state.accounts = [...(state.accounts || []), ...newData];
        } else {
          state.accounts = newData;
        }
        state.nextCursor = nextCursor;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        const newAccount = action.payload.data || action.payload;
        if (Array.isArray(state.accounts)) {
          state.accounts.unshift(newAccount);
        } else {
          state.accounts = [newAccount];
        }
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const updatedData = action.payload.data || action.payload;
        const index = state.accounts.findIndex(a => a.id === updatedData.id);
        if (index !== -1) {
          state.accounts[index] = updatedData;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(a => a.id !== action.payload);
      })
      .addMatcher(
        (action) => [createAccount.pending.type, updateAccount.pending.type].includes(action.type),
        (state) => { state.isSubmitting = true; }
      )
      .addMatcher(
        (action) => [createAccount.fulfilled.type, updateAccount.fulfilled.type, createAccount.rejected.type, updateAccount.rejected.type].includes(action.type),
        (state) => { state.isSubmitting = false; }
      );
  },
});

export default accountSlice.reducer;
