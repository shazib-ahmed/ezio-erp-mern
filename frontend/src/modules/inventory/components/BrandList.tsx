import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Edit, Trash2, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBrands, Brand } from '../slice/brandSlice';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';

interface BrandListProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  isSubmitting: boolean;
  search?: string;
}

const BrandList: React.FC<BrandListProps> = ({ 
  brands, 
  onEdit, 
  onDelete,
  isSubmitting,
  search
}) => {
  const dispatch = useAppDispatch();
  const { loading, nextCursor } = useAppSelector((state) => state.brand);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchBrands({ search, cursor: nextCursor }));
    }
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
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-bold py-4">Brand</TableHead>
              <TableHead className="font-bold text-center">Products</TableHead>
              <TableHead className="text-right font-bold pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && brands.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Tag className="h-8 w-8 opacity-20" />
                    <p>No brands found. Add your first brand to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id} className="hover:bg-muted/20 border-b border-border last:border-0 transition-colors">
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-10 w-10 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
                        ) : (
                          <Tag className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <span className="text-base">{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-foreground">
                    {brand._count?.products || 0}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(brand)}
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(brand)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </InfiniteScroll>
  );
};

export { BrandList };
