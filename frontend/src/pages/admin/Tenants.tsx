import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTenants, resetTenantsState, setSearchQuery, deleteTenant, updateTenant } from '@/core/tenants/slice/tenantsSlice';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Eye, Building2, Calendar, Search, Mail, Phone } from 'lucide-react';
import { CardSkeleton } from '@/shared/components/skeletons/CardSkeleton';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Input } from '@/shared/ui/input';
import { format } from 'date-fns';
import { TenantDetailsModal } from '@/modules/admin/components/TenantDetailsModal';
import { TenantFormModal } from '@/modules/admin/components/TenantFormModal';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { toast } from 'sonner';

const TenantsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tenants, loading, error, hasMore, nextCursor, searchQuery } = useAppSelector((state) => state.tenants);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial fetch and unmount cleanup
  useEffect(() => {
    dispatch(fetchTenants({}));
    return () => {
      dispatch(resetTenantsState());
    };
  }, [dispatch]);

  // Handle search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearchTerm));
      dispatch(fetchTenants({ search: debouncedSearchTerm }));
    }
  }, [debouncedSearchTerm, searchQuery, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchTenants({ cursor: nextCursor, search: searchQuery }));
    }
  };

  const handleViewDetails = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDetailsModalOpen(true);
  };



  const handleConfirmDelete = async () => {
    if (!selectedTenant) return;
    setIsSubmitting(true);
    try {
      await dispatch(deleteTenant(selectedTenant.id)).unwrap();
      toast.success(`Tenant "${selectedTenant.name}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setSelectedTenant(null);
    } catch (err: any) {
      toast.error(err || 'Failed to delete tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTenant = async (data: any) => {
    if (!selectedTenant) return;
    setIsSubmitting(true);
    try {
      await dispatch(updateTenant({ id: selectedTenant.id, data })).unwrap();
      toast.success(`Tenant "${selectedTenant.name}" updated successfully`);
      setIsEditModalOpen(false);
      setSelectedTenant(null);
    } catch (err: any) {
      toast.error(err || 'Failed to update tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Tenants</h1>
          <p className="text-muted-foreground">Manage and monitor all tenant registrations and active businesses.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tenants, owners..." 
              className="pl-9 bg-card shadow-none border-border h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={loading && tenants.length > 0}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {loading && tenants.length === 0 ? (
            <CardSkeleton count={6} />
          ) : error ? (
            <div className="col-span-full p-8 text-center bg-card border border-border rounded-2xl">
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => dispatch(fetchTenants({}))}>
                Try Again
              </Button>
            </div>
          ) : tenants.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-card border border-border rounded-2xl border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold">No tenants found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No results found for "${searchQuery}"` : 'There are currently no registered business workspaces in the system.'}
              </p>
            </div>
          ) : (
            tenants.map((tenant) => (
              <Card key={tenant.id} className="border-border bg-card shadow-none transition-all duration-300 group overflow-hidden flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Header: Company Name & Phone */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 overflow-hidden shrink-0">
                        {tenant.logo ? (
                          <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{tenant.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {tenant.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    {/* Industry */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Industry</span>
                      <Badge variant="outline" className="font-semibold bg-indigo-500/5 text-indigo-500 border-indigo-500/10">
                        {tenant.industry?.name || 'N/A'}
                      </Badge>
                    </div>

                    {/* Owner Info */}
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-2">User</span>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 overflow-hidden shrink-0">
                          {tenant.users[0]?.avatar ? (
                            <img src={tenant.users[0].avatar} alt={tenant.users[0].name} className="w-full h-full object-cover" />
                          ) : (
                            tenant.users[0]?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground line-clamp-1">{tenant.users[0]?.name}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="h-2.5 w-2.5" />
                            {tenant.users[0]?.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Modules */}
                    <div 
                      className="cursor-pointer group/modules" 
                      onClick={() => handleViewDetails(tenant)}
                      title="Click to view all modules"
                    >
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-2 group-hover/modules:text-primary transition-colors">Active Modules</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tenant.activeModules.slice(0, 4).map((mod) => (
                          <div 
                            key={mod.id} 
                            className="px-2 py-1 rounded-md bg-background border border-border text-[9px] font-bold text-foreground group-hover/modules:border-primary/30 transition-colors"
                          >
                            {mod.name}
                          </div>
                        ))}
                        {tenant.activeModules.length > 4 && (
                          <div className="px-2 py-1 rounded-md bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary">
                            +{tenant.activeModules.length - 4} More
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(tenant.createdAt), 'dd MMM, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs font-bold gap-1.5"
                        onClick={() => handleViewDetails(tenant)}
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </InfiniteScroll>

      <TenantDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        tenant={selectedTenant}
      />

      <TenantFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTenant}
        initialData={selectedTenant ? {
          companyName: selectedTenant.name,
          subdomain: selectedTenant.subdomain || '',
          industry: selectedTenant.industry?.name || '',
          ownerName: selectedTenant.users[0]?.name || '',
          email: selectedTenant.users[0]?.email || '',
          status: 'Active'
        } : undefined}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
        itemName={selectedTenant?.name}
        title="Delete Workspace"
        description="Are you sure you want to delete this business workspace? This action cannot be undone and all associated data will be permanently removed."
      />
    </>
  );
};

export default TenantsPage;
