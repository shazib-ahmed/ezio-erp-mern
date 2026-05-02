import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Users, PhoneCall } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { CustomerFormModal } from '@/modules/sales/components/CustomerFormModal';

const customers = [
  { id: 1, name: 'Global Industries', limit: 50000, due: 12500, lastPay: '2026-04-15', status: 'Good' },
  { id: 2, name: 'Apex Solutions', limit: 10000, due: 9500, lastPay: '2026-03-20', status: 'Warning' },
  { id: 3, name: 'Tech Corp', limit: 20000, due: 22000, lastPay: '2026-02-10', status: 'Blocked' },
];

const Customers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateCustomer = (data: any) => {
    console.log('Registering customer:', data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Credit</h1>
          <p className="text-muted-foreground">Manage customer credit limits, outstanding dues, and recovery.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Users className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Customer Name</TableHead>
              <TableHead className="font-bold text-right">Credit Limit</TableHead>
              <TableHead className="font-bold text-right">Total Due</TableHead>
              <TableHead className="font-bold">Last Payment</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-bold text-foreground">{c.name}</TableCell>
                <TableCell className="text-right font-medium">${c.limit.toLocaleString()}</TableCell>
                <TableCell className={cn(
                  "text-right font-bold",
                  c.due > c.limit ? "text-destructive" : "text-foreground"
                )}>
                  ${c.due.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.lastPay}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-medium",
                    c.status === 'Good' && "border-primary/20 text-primary bg-primary/5",
                    c.status === 'Warning' && "border-orange-500/20 text-orange-500 bg-orange-500/5",
                    c.status === 'Blocked' && "border-destructive/20 text-destructive bg-destructive/5"
                  )}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="gap-2">
                    <PhoneCall className="h-3 w-3" /> Remind
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomerFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateCustomer}
      />
    </MainLayout>
  );
};

export default Customers;
