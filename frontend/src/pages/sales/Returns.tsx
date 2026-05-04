import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { RotateCcw } from 'lucide-react';

const Returns: React.FC = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Returns & Refunds</h1>
          <p className="text-muted-foreground">Process sales returns, credit notes, and product refunds.</p>
        </div>
        <Button className="gap-2" variant="destructive">
          <RotateCcw className="h-4 w-4" /> Process Return
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Return No</TableHead>
              <TableHead className="font-bold">Order No</TableHead>
              <TableHead className="font-bold">Customer</TableHead>
              <TableHead className="font-bold">Reason</TableHead>
              <TableHead className="font-bold text-right">Amount</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: 1, rno: 'RET-001', ono: 'ORD-102', customer: 'Global Industries', reason: 'Damaged Goods', amount: 450, status: 'Completed' },
              { id: 2, rno: 'RET-002', ono: 'ORD-098', customer: 'Tech Corp', reason: 'Wrong Specification', amount: 1200, status: 'Pending' },
            ].map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-bold text-destructive">{r.rno}</TableCell>
                <TableCell className="font-medium">{r.ono}</TableCell>
                <TableCell className="font-semibold">{r.customer}</TableCell>
                <TableCell className="text-sm text-muted-foreground italic">"{r.reason}"</TableCell>
                <TableCell className="text-right font-bold text-foreground">${r.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={r.status === 'Completed' ? "border-primary/20 text-primary bg-primary/5" : "border-orange-500/20 text-orange-500 bg-orange-500/5"}>
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Returns;
