import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Landmark, Download, FileText } from 'lucide-react';

const Payroll: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Engine</h1>
          <p className="text-muted-foreground">Manage salary components, bonuses, and monthly disbursements.</p>
        </div>
        <Button className="gap-2">
          <Landmark className="h-4 w-4" /> Generate Payroll
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="font-bold text-lg">May 2026 Disbursement</h3>
          <Badge className="bg-primary/10 text-primary border border-primary/20">Draft</Badge>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Employee</TableHead>
              <TableHead className="font-bold text-right">Basic</TableHead>
              <TableHead className="font-bold text-right">Allowances</TableHead>
              <TableHead className="font-bold text-right">Deductions</TableHead>
              <TableHead className="font-bold text-right">Net Salary</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: 'Shazib Ahmed', basic: 5000, allow: 1200, ded: 250, net: 5950 },
              { name: 'Zayed Hasan', basic: 4000, allow: 800, ded: 150, net: 4650 },
              { name: 'Mahrab Khan', basic: 4500, allow: 1000, ded: 200, net: 5300 },
            ].map((pay, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold">{pay.name}</TableCell>
                <TableCell className="text-right">${pay.basic.toLocaleString()}</TableCell>
                <TableCell className="text-right text-primary">+${pay.allow.toLocaleString()}</TableCell>
                <TableCell className="text-right text-destructive">-${pay.ded.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold text-lg">${pay.net.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default Payroll;
