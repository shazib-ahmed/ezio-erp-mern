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
import { Edit, Trash2, Landmark, Wallet, Phone } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Account } from '../types';

const accountData: Account[] = [
  { id: 1, name: 'Main Cash', type: 'Cash', balance: 25000, status: 'Active' },
  { id: 2, name: 'Dutch Bangla Bank', type: 'Bank', accountNumber: '123.456.789', bankName: 'DBBL', balance: 450000, status: 'Active' },
  { id: 3, name: 'Company bKash', type: 'Mobile', accountNumber: '01712345678', balance: 12000, status: 'Active' },
  { id: 4, name: 'Petty Cash', type: 'Cash', balance: 5000, status: 'Active' },
];

const AccountList: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Account Name</TableHead>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="font-bold hidden md:table-cell">Account Details</TableHead>
            <TableHead className="font-bold">Balance</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountData.map((account) => (
            <TableRow key={account.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted border border-border">
                    {account.type === 'Bank' && <Landmark className="h-4 w-4 text-blue-500" />}
                    {account.type === 'Cash' && <Wallet className="h-4 w-4 text-primary" />}
                    {account.type === 'Mobile' && <Phone className="h-4 w-4 text-pink-500" />}
                  </div>
                  <span className="font-semibold">{account.name}</span>
                </div>
              </TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                {account.bankName && <span>{account.bankName} - </span>}
                {account.accountNumber || 'N/A'}
              </TableCell>
              <TableCell className="font-bold text-foreground">
                ${account.balance.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                  {account.status}
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

export { AccountList };
