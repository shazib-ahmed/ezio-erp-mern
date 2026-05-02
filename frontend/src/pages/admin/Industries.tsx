import React, { useState } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Plus, Tag, MoreVertical } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { IndustryFormModal } from '@/modules/admin/components/IndustryFormModal';

const industries = [
  { id: 1, name: 'Manufacturing', slug: 'manufacturing', count: 12, status: 'Active' },
  { id: 2, name: 'Retail', slug: 'retail', count: 45, status: 'Active' },
  { id: 3, name: 'Technology', slug: 'technology', count: 8, status: 'Active' },
  { id: 4, name: 'Hospitality', slug: 'hospitality', count: 0, status: 'Inactive' },
];

const Industries: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddIndustry = (data: any) => {
    console.log('Adding industry:', data);
    setIsModalOpen(false);
  };

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

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-4xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Industry Name</TableHead>
              <TableHead className="font-bold">Slug</TableHead>
              <TableHead className="font-bold text-center">Tenants</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {industries.map((ind) => (
              <TableRow key={ind.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 text-indigo-500">
                      <Tag className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-foreground">{ind.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{ind.slug}</code>
                </TableCell>
                <TableCell className="text-center font-semibold">{ind.count}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-bold",
                    ind.status === 'Active' && "border-primary/20 text-primary bg-primary/5",
                    ind.status === 'Inactive' && "border-muted-foreground/20 text-muted-foreground bg-muted-foreground/5"
                  )}>
                    {ind.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
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
