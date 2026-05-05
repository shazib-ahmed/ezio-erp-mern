import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Edit, Trash2, FolderTree } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCategories, Category } from '../slice/categorySlice';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isSubmitting?: boolean;
  search?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  isSubmitting = false,
  search
}) => {
  const dispatch = useAppDispatch();
  const { loading, nextCursor } = useAppSelector((state) => state.category);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchCategories({ search, cursor: nextCursor }));
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
            <TableRow>
              <TableHead className="font-bold">Category Name</TableHead>
              <TableHead className="font-bold text-center">Products</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && categories.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold flex items-center gap-2 text-foreground">
                    <FolderTree className="h-4 w-4 text-primary/60" />
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center font-medium text-foreground">{item._count?.products || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary"
                        onClick={() => onEdit(item)}
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(item)}
                        disabled={Boolean(item._count?.products && item._count.products > 0) || isSubmitting}
                        title={item._count?.products && item._count.products > 0 ? "Cannot delete category with products" : "Delete category"}
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

export { CategoryList };
