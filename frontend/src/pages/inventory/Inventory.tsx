import React from 'react';
import { ProductList } from '@/modules/inventory/components/ProductList';
import { Button } from '@/shared/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { ProductFormModal } from '@/modules/inventory/components/ProductFormModal';

const Inventory: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleAddProduct = (data: any) => {
    console.log('Adding new product:', data);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Manage your products and stock levels.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Input 
              placeholder="Search products by name, SKU..." 
              className="bg-background border-border"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <ProductList />

      <ProductFormModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddProduct}
      />
    </>
  );
};

export default Inventory;
