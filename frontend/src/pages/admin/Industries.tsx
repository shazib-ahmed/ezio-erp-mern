import React, { useState } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Plus, Tag, MoreVertical } from 'lucide-react';
import { IndustryFormModal } from '@/modules/admin/components/IndustryFormModal';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchIndustries, createIndustry, deleteIndustry } from '@/core/industry/slice/industrySlice';
import { TableSkeleton } from '@/shared/components/skeletons/TableSkeleton';
import { Industry } from '@/core/industry/types/industry.types';

const Industries: React.FC = () => {
  const dispatch = useAppDispatch();
  const { industries, loading } = useAppSelector((state) => state.industry);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  const handleAddIndustry = async (data: any) => {
    await dispatch(createIndustry(data));
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this industry?')) {
      await dispatch(deleteIndustry(id));
    }
  };

  if (loading && industries.length === 0) return (
    <MainLayout>
      <TableSkeleton />
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Industries</h1>
          <p className="text-muted-foreground">Manage business categories and industry-specific defaults.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Industry
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold py-4 pl-6">Industry Name</TableHead>
              <TableHead className="font-bold">Slug</TableHead>
              <TableHead className="font-bold text-center">Tenants</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {industries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Tag className="h-8 w-8 opacity-20" />
                    <p>No industries found. Click "Add Industry" to create one.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              industries.map((ind: Industry) => (
                <TableRow key={ind.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 text-primary">
                        <Tag className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-foreground">{ind.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono border border-border">
                      {ind.name.toLowerCase().replace(/\s+/g, '-')}
                    </code>
                  </TableCell>
                  <TableCell className="text-center font-bold text-foreground">
                    {ind._count?.tenants || 0}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold bg-emerald-500/5 border-emerald-500/20 text-emerald-500">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/5 hover:text-destructive" onClick={() => handleDelete(ind.id)}>
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <IndustryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddIndustry}
      />
    </MainLayout>
  );
};

export default Industries;
