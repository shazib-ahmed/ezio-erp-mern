import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { Transaction } from '../types';

const transactionData: Transaction[] = [
  { id: 1, date: '2026-05-01', category: 'Sales', description: 'Monthly Revenue', amount: 45000, type: 'Income', status: 'Completed' },
  { id: 2, date: '2026-05-02', category: 'Utilities', description: 'Electricity Bill', amount: 1200, type: 'Expense', status: 'Completed' },
  { id: 3, date: '2026-05-03', category: 'Inventory', description: 'Raw Material Purchase', amount: 8500, type: 'Expense', status: 'Pending' },
  { id: 4, date: '2026-05-04', category: 'Services', description: 'Software Subscription', amount: 250, type: 'Expense', status: 'Completed' },
];

const TransactionList: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="font-bold">Category</TableHead>
            <TableHead className="font-bold hidden md:table-cell">Description</TableHead>
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionData.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30">
              <TableCell className="text-muted-foreground">{item.date}</TableCell>
              <TableCell className="font-semibold">{item.category}</TableCell>
              <TableCell className="hidden md:table-cell">{item.description}</TableCell>
              <TableCell className={cn(
                "font-bold",
                item.type === 'Income' ? "text-primary" : "text-destructive"
              )}>
                {item.type === 'Income' ? '+' : '-'} ${item.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-medium",
                    item.status === 'Completed' && "border-primary/20 text-primary bg-primary/5",
                    item.status === 'Pending' && "border-orange-500/20 text-orange-500 bg-orange-500/5"
                  )}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { TransactionList };
