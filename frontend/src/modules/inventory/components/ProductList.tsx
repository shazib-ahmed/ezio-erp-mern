import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { ProductFormModal } from './ProductFormModal';
import { Product } from '../types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchProducts, deleteProduct, updateProduct, fetchInventoryStats } from '../slice/inventorySlice';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';

interface ProductListProps {
  search?: string;
}

const ProductList: React.FC<ProductListProps> = ({ search }) => {
  const dispatch = useAppDispatch();
  const { products, loading, error, nextCursor } = useAppSelector((state) => state.inventory);
  const { user } = useAppSelector((state) => state.auth);
  const industryAttributes = (user as any)?.industry?.attributes || [];
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({ search }));
  }, [dispatch, search]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchProducts({ search, cursor: nextCursor }));
    }
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await dispatch(deleteProduct(selectedProduct.id));
      setIsDeleteDialogOpen(false);
      dispatch(fetchProducts({ search }));
      dispatch(fetchInventoryStats());
    }
  };

  const handleUpdate = async (data: any) => {
    if (selectedProduct) {
      await dispatch(updateProduct({ id: selectedProduct.id, data }));
      setIsEditModalOpen(false);
      dispatch(fetchProducts({ search }));
      dispatch(fetchInventoryStats());
    }
  };



  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl text-destructive">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => dispatch(fetchProducts())}>
          Try Again
        </Button>
      </div>
    );
  }

  const getProductImage = (product: any) => {
    if (product.thumb) return product.thumb;
    const attrs = product.attributes || {};
    const imageUrl = Object.values(attrs).find(val => 
      typeof val === 'string' && val.startsWith('http') && 
      (val.match(/\.(jpeg|jpg|gif|png|webp)/i) || val.includes('cloudinary'))
    );
    return imageUrl as string | undefined;
  };

  return (
    <InfiniteScroll
      onLoadMore={handleLoadMore}
      hasMore={Boolean(nextCursor)}
      isLoading={loading}
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Product</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              
              {industryAttributes.map((attr: any) => (
                <TableHead key={attr.name} className="font-bold">{attr.name}</TableHead>
              ))}
              
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && products.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  {industryAttributes.map((attr: any) => (
                     <TableCell key={attr.name}><Skeleton className="h-5 w-24" /></TableCell>
                  ))}
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={industryAttributes.length + 3} className="h-32 text-center text-muted-foreground">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            ) : (
              products.map((item) => {
                const imageUrl = getProductImage(item);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                          {imageUrl ? (
                            <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="text-[10px] text-muted-foreground uppercase font-bold">No IMG</div>
                          )}
                        </div>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.category?.name || (item as any).categoryName || 'N/A'}</TableCell>
                  
                  {industryAttributes.map((attr: any) => (
                    <TableCell key={attr.name}>
                      {attr.name.toLowerCase() === 'brand' 
                        ? (item.brand?.name || '-') 
                        : (item.attributes?.[attr.name] || '-')}
                    </TableCell>
                  ))}
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
              );
            })
            )}
          </TableBody>
        </Table>

        <DeleteConfirmationModal 
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title={selectedProduct ? `Delete ${selectedProduct.name}?` : "Delete Product?"}
          description="Are you sure you want to delete this product? This will remove it from your inventory records."
        />

        <ProductFormModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
          initialData={selectedProduct}
        />
      </div>
    </InfiniteScroll>
  );
};

export { ProductList };
