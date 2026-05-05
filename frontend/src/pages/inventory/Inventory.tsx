import React, { useState } from 'react';
import { ProductList } from '@/modules/inventory/components/ProductList';
import { Button } from '@/shared/ui/button';
import { Plus, Download, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { ProductFormModal } from '@/modules/inventory/components/ProductFormModal';
import { useAppDispatch } from '@/app/hooks';
import { addProduct, fetchProducts, fetchInventoryStats } from '@/modules/inventory/slice/inventorySlice';
import { toast } from 'sonner';

import { useDebounce } from '@/shared/hooks/useDebounce';

const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleAddProduct = async (data: any) => {
    try {
      await dispatch(addProduct(data)).unwrap();
      toast.success('Product added successfully');
      setIsAddModalOpen(false);
      // Refetch to keep data in sync
      dispatch(fetchProducts({ search: debouncedSearch }));
      dispatch(fetchInventoryStats());
    } catch (err: any) {
      toast.error(err || 'Failed to add product');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Manage your products and stock levels.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 h-11 border-border">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="gap-2 h-11 bg-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products by name, SKU..." 
            className="pl-10 h-11 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ProductList search={debouncedSearch} />

      <ProductFormModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddProduct}
      />
    </>
  );
};

export default Inventory;
