import axiosInstance from '@/shared/lib/axios';
import { Product, InventoryStats } from '../types';

export const inventoryService = {
  getProducts: async (params?: { search?: string; limit?: number; cursor?: number }) => {
    const response = await axiosInstance.get<{ data: Product[]; nextCursor: number | null }>(
      '/inventory/products',
      { params }
    );
    return (response.data as any).data;
  },

  getProduct: async (id: number) => {
    const response = await axiosInstance.get<Product>(`/inventory/products/${id}`);
    return (response.data as any).data;
  },

  createProduct: async (data: any) => {
    const response = await axiosInstance.post<Product>('/inventory/products', data);
    return (response.data as any).data;
  },

  updateProduct: async (id: number, data: any) => {
    const response = await axiosInstance.put<Product>(`/inventory/products/${id}`, data);
    return (response.data as any).data;
  },

  deleteProduct: async (id: number) => {
    const response = await axiosInstance.delete(`/inventory/products/${id}`);
    return (response.data as any).data;
  },

  adjustStock: async (id: number, adjustment: number) => {
    const response = await axiosInstance.post(`/inventory/products/${id}/adjust-stock`, {
      adjustment,
    });
    return (response.data as any).data;
  },

  getStats: async () => {
    const response = await axiosInstance.get<InventoryStats>('/inventory/stats');
    return (response.data as any).data;
  },
};
