import axiosInstance from '@/shared/lib/axios';

export const salesService = {
  getSales: async (params?: { search?: string; limit?: number; cursor?: number }) => {
    const response = await axiosInstance.get('/sales', { params });
    return response.data;
  },

  getCustomers: async () => {
    const response = await axiosInstance.get('/sales/customers');
    return response.data;
  },

  createSale: async (data: any) => {
    const response = await axiosInstance.post('/sales', data);
    return response.data;
  }
};
