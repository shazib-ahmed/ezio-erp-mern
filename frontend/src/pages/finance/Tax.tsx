import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { StatsCard } from '@/shared/components/common/StatsCard';
import { Receipt, PieChart, Landmark } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';

const Tax: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tax Management</h1>
          <p className="text-muted-foreground">Automated VAT and tax calculations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard label="Pending VAT" value="$12,430" icon={Receipt} iconColor="text-orange-500" />
        <StatsCard label="Tax Paid (Q1)" value="$45,210" icon={Landmark} iconColor="text-primary" />
        <StatsCard label="Tax Rate (Avg)" value="15%" icon={PieChart} iconColor="text-blue-500" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Transaction</TableHead>
              <TableHead className="font-bold">Tax Type</TableHead>
              <TableHead className="font-bold">Taxable Amount</TableHead>
              <TableHead className="font-bold">Tax Amount</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { desc: 'Sales - INV-2026-001', type: 'VAT (15%)', base: 1000, tax: 150, status: 'Calculated' },
              { desc: 'Purchase - PR-2026-042', type: 'WHT (5%)', base: 5000, tax: 250, status: 'Deducted' },
              { desc: 'Service Fee - SRV-003', type: 'VAT (15%)', base: 200, tax: 30, status: 'Calculated' },
            ].map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-foreground">{item.desc}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>${item.base.toLocaleString()}</TableCell>
                <TableCell className="font-bold text-primary">${item.tax.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default Tax;
