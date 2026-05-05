import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, PackageCheck, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchProducts, fetchInventoryStats, updateProduct } from '@/modules/inventory/slice/inventorySlice';
import { ProductFormModal } from '@/modules/inventory/components/ProductFormModal';
import { Product } from '@/modules/inventory/types';

import { useDebounce } from '@/shared/hooks/useDebounce';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';

const StockManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, stats, loading, nextCursor } = useAppSelector((state) => state.inventory);
  const { user } = useAppSelector((state) => state.auth);
  const currencySymbol = user?.tenant?.currencySymbol || '$';
  const industryAttributes = (user as any)?.industry?.attributes || [];
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({ search: debouncedSearch }));
    dispatch(fetchInventoryStats());
  }, [dispatch, debouncedSearch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchProducts({ search: debouncedSearch, cursor: nextCursor }));
    }
  };

  const handleUpdate = async (data: any) => {
    if (selectedProduct) {
      await dispatch(updateProduct({ id: selectedProduct.id, data }));
      setIsEditModalOpen(false);
      dispatch(fetchInventoryStats()); // Refresh stats after update
    }
  };

  return (
    <InfiniteScroll
      onLoadMore={handleLoadMore}
      hasMore={Boolean(nextCursor)}
      isLoading={loading}
    >
      <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and track your industry-specific product data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm group hover:border-primary/20 transition-all">
          <p className="text-sm font-medium text-muted-foreground mb-1">Low Stock Alerts</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-foreground">{stats?.lowStock.toString().padStart(2, '0') || '00'}</h3>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <Badge variant="outline" className="mt-4 bg-rose-500/5 text-rose-500 border-rose-500/10 font-bold">Action Needed</Badge>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm group hover:border-primary/20 transition-all">
          <p className="text-sm font-medium text-muted-foreground mb-1">Out of Stock</p>
          <h3 className="text-3xl font-bold text-foreground">{stats?.outOfStock.toString().padStart(2, '0') || '00'}</h3>
          <p className="text-xs text-muted-foreground mt-4">Items requiring attention</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm group hover:border-primary/20 transition-all">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Products</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-foreground">{stats?.totalProducts.toString().padStart(2, '0') || '00'}</h3>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Active items in inventory</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Product Name..." 
            className="pl-10 h-11 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-bold py-4">Product Name</TableHead>
              {industryAttributes.map((attr: any) => (
                <TableHead key={attr.name} className={cn("font-bold", attr.name === 'Stock' && "text-right")}>
                  {attr.name}
                </TableHead>
              ))}
              <TableHead className="text-right font-bold pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && products.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  {industryAttributes.map((attr: any) => (
                    <TableCell key={attr.name}><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                  ))}
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={industryAttributes.length + 2} className="h-32 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 border-b border-border last:border-0 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center shrink-0">
                        {item.thumb ? (
                          <img src={item.thumb} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-[8px] text-muted-foreground uppercase font-bold text-center p-1">No Image</div>
                        )}
                      </div>
                      <span className="font-bold text-foreground">{item.name}</span>
                    </div>
                  </TableCell>
                  {industryAttributes.map((attr: any) => (
                    <TableCell key={attr.name} className={cn(attr.name === 'Stock' && "text-right font-black")}>
                      {attr.name.toLowerCase() === 'brand' 
                        ? (item.brand?.name || '-') 
                        : (['price', 'cost', 'rate', 'mrp', 'unit price'].some(k => attr.name.toLowerCase().includes(k))
                            ? `${currencySymbol}${item.attributes?.[attr.name] || '0'}`
                            : (item.attributes?.[attr.name] || '-'))}
                    </TableCell>
                  ))}
                  <TableCell className="text-right pr-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary h-8 gap-1 font-black hover:bg-primary/5 hover:text-primary transition-all"
                      onClick={() => {
                        setSelectedProduct(item);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Update <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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

export default StockManagement;
