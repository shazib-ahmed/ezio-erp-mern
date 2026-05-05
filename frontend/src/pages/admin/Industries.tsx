import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Tag, Edit, Trash2, Search } from 'lucide-react';
import { IndustryFormModal } from '@/modules/admin/components/IndustryFormModal';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Input } from '@/shared/ui/input';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchIndustries, createIndustry, deleteIndustry, updateIndustry, resetIndustryState, setSearchQuery } from '@/core/industry/slice/industrySlice';
import { CardSkeleton } from '@/shared/components/skeletons/CardSkeleton';
import { Industry } from '@/core/industry/types/industry.types';
import { toast } from 'sonner';

const Industries: React.FC = () => {
  const dispatch = useAppDispatch();
  const { industries, loading, isSubmitting, hasMore, nextCursor, searchQuery } = useAppSelector((state) => state.industry);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Initial fetch and unmount cleanup
  React.useEffect(() => {
    dispatch(fetchIndustries({}));
    return () => {
      dispatch(resetIndustryState());
    };
  }, [dispatch]);

  // Handle search changes
  React.useEffect(() => {
    if (debouncedSearchTerm !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearchTerm));
      dispatch(fetchIndustries({ search: debouncedSearchTerm }));
    }
  }, [debouncedSearchTerm, searchQuery, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchIndustries({ cursor: nextCursor, search: searchQuery }));
    }
  };

  const handleOpenModal = (industry: Industry | null = null) => {
    setEditingIndustry(industry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingIndustry(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingIndustry) {
        await dispatch(updateIndustry({ id: editingIndustry.id.toString(), data })).unwrap();
        toast.success(`Industry updated successfully`);
      } else {
        await dispatch(createIndustry(data)).unwrap();
        toast.success(`Industry created successfully`);
      }
      dispatch(fetchIndustries({ search: searchQuery }));
      handleCloseModal();
    } catch (error: any) {
      toast.error(error || 'Something went wrong');
    }
  };

  const getAttributeStats = (attributes: any[]) => {
    if (!Array.isArray(attributes)) return { total: 0, required: 0, optional: 0 };
    const total = attributes.length;
    const required = attributes.filter(a => a.required).length;
    const optional = total - required;
    return { total, required, optional };
  };

  const handleDeleteClick = (industry: Industry) => {
    setIndustryToDelete(industry);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!industryToDelete) return;
    try {
      await dispatch(deleteIndustry(industryToDelete.id)).unwrap();
      toast.success(`Industry "${industryToDelete.name}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setIndustryToDelete(null);
    } catch (error: any) {
      toast.error(error || 'Failed to delete industry');
    }
  };



  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Industries</h1>
          <p className="text-muted-foreground">Manage business categories and industry-specific defaults.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search industries..." 
              className="pl-9 bg-card shadow-none border-border h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="gap-2 bg-primary shadow-none h-11 w-full sm:w-auto" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4" /> Add Industry
          </Button>
        </div>
      </div>

      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={loading && industries.length > 0}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && industries.length === 0 ? (
            <CardSkeleton count={8} />
          ) : industries.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-card border border-border rounded-2xl border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-bold">No industries found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No results found for "${searchQuery}"` : 'Click "Add Industry" to create your first business sector.'}
              </p>
            </div>
          ) : (
            industries.map((ind: Industry) => {
              const { total, required, optional } = getAttributeStats(ind.attributes as any[]);
              return (
                <Card key={ind.id} className="border-border bg-card shadow-none transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Tag className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5" 
                          onClick={() => handleOpenModal(ind)}
                          disabled={isSubmitting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5" 
                          onClick={() => handleDeleteClick(ind)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{ind.name}</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Total</span>
                          <span className="text-sm font-bold text-foreground">{total}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Req.</span>
                          <span className="text-sm font-bold text-primary">{required}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Opt.</span>
                          <span className="text-sm font-bold text-muted-foreground">{optional}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Registered Tenants</span>
                          <span className="text-lg font-black text-foreground">{ind._count?.tenants || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </InfiniteScroll>

      <IndustryFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmit}
        initialData={editingIndustry}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
        itemName={industryToDelete?.name}
        title="Delete Industry"
        description="Are you sure you want to delete this industry? This will affect all businesses registered under this category."
      />
    </>
  );
};

export default Industries;
