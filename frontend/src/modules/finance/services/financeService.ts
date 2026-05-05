import axios from '@/shared/lib/axios';

export const financeService = {
  // Accounts
  getAccounts: async (params?: { search?: string; limit?: number; cursor?: number }) => {
    const response = await axios.get('/finance/accounts', { params });
    return response.data;
  },
  createAccount: async (data: any) => {
    const response = await axios.post('/finance/accounts', data);
    return response.data;
  },
  updateAccount: async (id: number, data: any) => {
    const response = await axios.patch(`/finance/accounts/${id}`, data);
    return response.data;
  },
  deleteAccount: async (id: number) => {
    const response = await axios.delete(`/finance/accounts/${id}`);
    return response.data;
  },

  // Expenses
  getExpenses: async (params?: { search?: string; limit?: number; cursor?: number }) => {
    const response = await axios.get('/finance/expenses', { params });
    return response.data;
  },
  createExpense: async (data: any) => {
    const response = await axios.post('/finance/expenses', data);
    return response.data;
  },
  updateExpense: async (id: number, data: any) => {
    const response = await axios.patch(`/finance/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id: number) => {
    const response = await axios.delete(`/finance/expenses/${id}`);
    return response.data;
  },

  // Transactions
  getTransactions: async (params?: { search?: string; limit?: number; cursor?: number }) => {
    const response = await axios.get('/finance/transactions', { params });
    return response.data;
  },
  getStats: async () => {
    const response = await axios.get('/finance/transactions/stats');
    return response.data;
  },
};
