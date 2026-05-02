import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { StatsCard } from '@/shared/components/common/StatsCard';
import { ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const PayableReceivable: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accounts Payable & Receivable</h1>
          <p className="text-muted-foreground">Manage your debtors and creditors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard 
          label="Total Receivable (Debtors)" 
          value="$84,500" 
          change="+5.2%" 
          trend="up" 
          icon={ArrowDownLeft} 
          iconColor="text-primary"
        />
        <StatsCard 
          label="Total Payable (Creditors)" 
          value="$42,300" 
          change="+12.4%" 
          trend="up" 
          icon={ArrowUpRight} 
          iconColor="text-destructive"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="font-bold text-lg">Outstanding Invoices</h3>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Entity</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Due Date</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: 'Global Tech Solutions', type: 'Receivable', amount: 12500, date: '2026-05-15', status: 'Pending' },
              { name: 'Paper & Co.', type: 'Payable', amount: 3400, date: '2026-05-10', status: 'Overdue' },
              { name: 'Vertex Systems', type: 'Receivable', amount: 4500, date: '2026-05-20', status: 'Pending' },
            ].map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    item.type === 'Receivable' ? "text-primary border-primary/20 bg-primary/5" : "text-destructive border-destructive/20 bg-destructive/5"
                  )}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">${item.amount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{item.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    item.status === 'Overdue' ? "text-destructive border-destructive/20 bg-destructive/5" : "text-orange-500 border-orange-500/20 bg-orange-500/5"
                  )}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" /> View Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default PayableReceivable;
