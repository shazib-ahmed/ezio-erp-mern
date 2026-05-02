export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
