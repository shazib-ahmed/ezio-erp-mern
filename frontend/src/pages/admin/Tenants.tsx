import React, { useState } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Plus, Building2, MoreVertical, ExternalLink } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { TenantFormModal } from '@/modules/admin/components/TenantFormModal';

const tenants = [
  { id: 1, companyName: 'Global Industries', subdomain: 'global', industry: 'Manufacturing', owner: 'Shazib Ahmed', status: 'Active' },
  { id: 2, companyName: 'Apex Solutions', subdomain: 'apex', industry: 'Retail', owner: 'John Doe', status: 'Active' },
  { id: 3, companyName: 'Tech Corp', subdomain: 'techcorp', industry: 'Technology', owner: 'Sarah Khan', status: 'Suspended' },
];

const Tenants: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegisterTenant = (data: any) => {
    console.log('Registering tenant:', data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenants/Companies</h1>
          <p className="text-muted-foreground">Manage multi-tenant company instances and subscriptions.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Register Tenant
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Company</TableHead>
              <TableHead className="font-bold">Industry</TableHead>
              <TableHead className="font-bold">Owner</TableHead>
              <TableHead className="font-bold">Subdomain</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-foreground">{tenant.companyName}</span>
                  </div>
                </TableCell>
                <TableCell>{tenant.industry}</TableCell>
                <TableCell className="text-sm font-medium">{tenant.owner}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded border border-border">
                    {tenant.subdomain}.ezioerp.com
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-bold",
                    tenant.status === 'Active' && "border-primary/20 text-primary bg-primary/5",
                    tenant.status === 'Suspended' && "border-destructive/20 text-destructive bg-destructive/5"
                  )}>
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TenantFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRegisterTenant}
      />
    </MainLayout>
  );
};

export default Tenants;
