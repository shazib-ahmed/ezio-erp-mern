export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  brandId?: number;
  brand?: {
    id: number;
    name: string;
    description?: string;
  };
  attributes?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
}
