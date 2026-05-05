import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBrands, createBrand, updateBrand, deleteBrand, Brand } from '@/modules/inventory/slice/brandSlice';
import { Button } from '@/shared/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { BrandList } from '@/modules/inventory/components/BrandList';
import { BrandFormModal } from '@/modules/inventory/components/BrandFormModal';

import { useDebounce } from '@/shared/hooks/useDebounce';

const Brands: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brands, isSubmitting } = useAppSelector((state) => state.brand);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchBrands({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  const handleOpenModal = (brand: Brand | null = null) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (selectedBrand) {
        await dispatch(updateBrand({ id: selectedBrand.id, data })).unwrap();
        toast.success('Brand updated successfully');
      } else {
        await dispatch(createBrand(data)).unwrap();
        toast.success('Brand created successfully');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (selectedBrand) {
      try {
        await dispatch(deleteBrand(selectedBrand.id)).unwrap();
        toast.success('Brand deleted successfully');
        setIsDeleteOpen(false);
      } catch (err: any) {
        toast.error(err || 'Failed to delete brand');
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground">Manage your product brands and manufacturers.</p>
        </div>
        
        <Button className="gap-2 h-11 bg-primary" onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" /> Add Brand
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search brands..." 
            className="pl-10 h-11 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <BrandList 
        brands={brands}
        onEdit={handleOpenModal}
        onDelete={(brand) => {
          setSelectedBrand(brand);
          setIsDeleteOpen(true);
        }}
        isSubmitting={isSubmitting}
        search={debouncedSearch}
      />

      <BrandFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedBrand}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Brand?"
        description="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </>
  );
};

export default Brands;
