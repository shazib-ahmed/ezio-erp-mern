import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { StatsCard } from '@/shared/components/common/StatsCard';
import { Building2, Truck, ShieldCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';

const Assets: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Management</h1>
          <p className="text-muted-foreground">Manage your company's physical and fixed assets.</p>
        </div>
        <Button className="gap-2">Add New Asset</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard label="Total Asset Value" value="$1,245,000" icon={Building2} />
        <StatsCard label="Depreciation (YTD)" value="$42,500" icon={Truck} iconColor="text-orange-500" />
        <StatsCard label="Insured Assets" value="24" icon={ShieldCheck} iconColor="text-primary" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Asset Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Purchase Value</TableHead>
              <TableHead className="font-bold">Current Value</TableHead>
              <TableHead className="font-bold">Purchase Date</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: 'Headquarters Building', cat: 'Property', val: 850000, cur: 920000, date: '2022-01-01' },
              { name: 'Industrial Lathe v4', cat: 'Machinery', val: 120000, cur: 95000, date: '2024-03-15' },
              { name: 'Delivery Van 01', cat: 'Vehicle', val: 35000, cur: 28000, date: '2025-06-10' },
            ].map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold text-foreground">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.cat}</TableCell>
                <TableCell>${item.val.toLocaleString()}</TableCell>
                <TableCell className="font-bold">${item.cur.toLocaleString()}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className="text-right text-primary hover:underline cursor-pointer">Details</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default Assets;
