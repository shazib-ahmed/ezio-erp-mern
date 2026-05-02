import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Send, Plus, Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { QuotationFormModal } from '@/modules/sales/components/QuotationFormModal';

const quotations = [
  { id: 1, qno: 'QTN-2026-001', customer: 'Global Industries', date: '2026-05-01', expiry: '2026-05-15', total: 12500, status: 'Sent' },
  { id: 2, qno: 'QTN-2026-002', customer: 'Apex Solutions', date: '2026-05-02', expiry: '2026-05-16', total: 4200, status: 'Accepted' },
  { id: 3, qno: 'QTN-2026-003', customer: 'Tech Corp', date: '2026-04-28', expiry: '2026-05-10', total: 890, status: 'Expired' },
];

const Quotations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateQuotation = (data: any) => {
    console.log('Creating quotation:', data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
          <p className="text-muted-foreground">Manage customer quotes and proforma invoices.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Create Quotation
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Quotation No</TableHead>
              <TableHead className="font-bold">Customer</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Expiry</TableHead>
              <TableHead className="font-bold text-right">Amount</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-bold text-primary">{q.qno}</TableCell>
                <TableCell className="font-semibold">{q.customer}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{q.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{q.expiry}</TableCell>
                <TableCell className="text-right font-bold">${q.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-medium",
                    q.status === 'Sent' && "border-blue-500/20 text-blue-500 bg-blue-500/5",
                    q.status === 'Accepted' && "border-primary/20 text-primary bg-primary/5",
                    q.status === 'Expired' && "border-destructive/20 text-destructive bg-destructive/5"
                  )}>
                    {q.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Send className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <QuotationFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateQuotation}
      />
    </MainLayout>
  );
};

export default Quotations;
