import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchCategories, createCategory, updateCategory, deleteCategory, Category } from '@/modules/inventory/slice/categorySlice';
import { Button } from '@/shared/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { CategoryList } from '@/modules/inventory/components/CategoryList';
import { CategoryFormModal } from '@/modules/inventory/components/CategoryFormModal';

import { useDebounce } from '@/shared/hooks/useDebounce';

const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, isSubmitting } = useAppSelector((state) => state.category);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchCategories({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  const handleOpenModal = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: { name: string }) => {
    try {
      if (selectedCategory) {
        await dispatch(updateCategory({ id: selectedCategory.id, data })).unwrap();
        toast.success('Category updated successfully');
      } else {
        await dispatch(createCategory(data)).unwrap();
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await dispatch(deleteCategory(selectedCategory.id)).unwrap();
        toast.success('Category deleted successfully');
        setIsDeleteOpen(false);
      } catch (err: any) {
        toast.error(err || 'Failed to delete category');
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories and organization.</p>
        </div>
        
        <Button className="gap-2 h-11 bg-primary" onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search categories..." 
            className="pl-10 h-11 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <CategoryList 
        categories={categories}
        onEdit={handleOpenModal}
        onDelete={(category) => {
          setSelectedCategory(category);
          setIsDeleteOpen(true);
        }}
        isSubmitting={isSubmitting}
        search={debouncedSearch}
      />

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category?"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </>
  );
};

export default Categories;
