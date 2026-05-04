import React, { useEffect } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTenants, resetTenantsState } from '@/core/tenants/slice/tenantsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Edit, Trash2, Eye, Building2, Calendar } from 'lucide-react';
import { TableSkeleton } from '@/shared/components/skeletons/TableSkeleton';
import { InfiniteScroll } from '@/shared/components/common/InfiniteScroll';
import { format } from 'date-fns';

const TenantsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tenants, loading, error, hasMore, nextCursor } = useAppSelector((state) => state.tenants);

  useEffect(() => {
    dispatch(fetchTenants());
    return () => {
      dispatch(resetTenantsState());
    };
  }, [dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(fetchTenants(nextCursor));
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Workspaces</h1>
          <p className="text-muted-foreground">Manage and monitor all tenant registrations and active businesses.</p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2 bg-primary shadow-none h-11">
            <Building2 className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card shadow-none overflow-hidden">
        <CardHeader className="border-b border-border p-6 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Tenant Directory</CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">
              {tenants.length} Showing
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && tenants.length === 0 ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => dispatch(fetchTenants())}>
                Try Again
              </Button>
            </div>
          ) : tenants.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold">No tenants found</h3>
              <p className="text-muted-foreground">There are currently no registered business workspaces in the system.</p>
            </div>
          ) : (
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={loading}
              className="w-full"
            >
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold pl-6">Company Information</TableHead>
                    <TableHead className="font-bold">Industry</TableHead>
                    <TableHead className="font-bold">Owner</TableHead>
                    <TableHead className="font-bold">Modules</TableHead>
                    <TableHead className="font-bold">Joined Date</TableHead>
                    <TableHead className="font-bold text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{tenant.name}</span>
                          <span className="text-xs text-muted-foreground">{tenant.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold bg-indigo-500/5 text-indigo-500 border-indigo-500/10">
                          {tenant.industry?.name || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {tenant.users[0]?.user.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{tenant.users[0]?.user.name}</span>
                            <span className="text-[10px] text-muted-foreground">{tenant.users[0]?.user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {tenant.activeModules.slice(0, 3).map((mod) => (
                            <div 
                              key={mod.id} 
                              className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center"
                              title={mod.name}
                            >
                              <span className="text-[8px] font-bold">{mod.code.split('_')[1]?.charAt(0)}</span>
                            </div>
                          ))}
                          {tenant.activeModules.length > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">
                              +{tenant.activeModules.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(tenant.createdAt), 'dd MMM, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </InfiniteScroll>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TenantsPage;
