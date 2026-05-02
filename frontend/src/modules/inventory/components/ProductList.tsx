import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { ProductFormModal } from './ProductFormModal';
import { Product } from '../types';

const inventoryData: Product[] = [
  { id: 1, name: 'Industrial Motor', sku: 'MOT-001', category: 'Hardware', stock: 124, price: '$450.00', status: 'In Stock' },
  { id: 2, name: 'Precision Lathe', sku: 'LTH-042', category: 'Machinery', stock: 12, price: '$2,400.00', status: 'Low Stock' },
  { id: 3, name: 'Control Panel V3', sku: 'CPN-003', category: 'Electronics', stock: 0, price: '$120.00', status: 'Out of Stock' },
  { id: 4, name: 'Safety Helmet', sku: 'SAF-99', category: 'Safety', stock: 450, price: '$25.00', status: 'In Stock' },
];

const ProductList: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDelete = () => {
    console.log('Deleting product:', selectedProduct?.name);
    setIsDeleteDialogOpen(false);
  };

  const handleUpdate = (data: Product) => {
    console.log('Updating product:', data);
    setIsEditModalOpen(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Product Name</TableHead>
            <TableHead className="font-bold">SKU</TableHead>
            <TableHead className="font-bold hidden md:table-cell">Category</TableHead>
            <TableHead className="font-bold">Stock</TableHead>
            <TableHead className="font-bold hidden sm:table-cell">Price</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryData.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30">
              <TableCell className="font-semibold">{item.name}</TableCell>
              <TableCell className="text-muted-foreground">{item.sku}</TableCell>
              <TableCell className="hidden md:table-cell">{item.category}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell className="hidden sm:table-cell">{item.price}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-medium",
                    item.status === 'In Stock' && "border-primary/20 text-primary bg-primary/5",
                    item.status === 'Low Stock' && "border-orange-500/20 text-orange-500 bg-orange-500/5",
                    item.status === 'Out of Stock' && "border-destructive/20 text-destructive bg-destructive/5"
                  )}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationModal 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={selectedProduct ? `Delete ${selectedProduct.name}?` : "Delete Product?"}
        description="Are you sure you want to delete this product? This will remove it from your inventory records forever."
      />

      <ProductFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={selectedProduct}
      />
    </div>
  );
};

export { ProductList };
