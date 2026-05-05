import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Download, Filter, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { TransactionList } from '@/modules/finance/components/TransactionList';
import { FinanceSummary } from '@/modules/finance/components/FinanceSummary';
import { useAppDispatch } from '@/app/hooks';
import { fetchTransactions } from '@/modules/finance/slice/transactionSlice';

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch(fetchTransactions({ search: e.target.value }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Monitor all financial movements.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border">
            <Download className="h-4 w-4" /> Export Ledger
          </Button>
        </div>
      </div>

      <FinanceSummary />

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Trx ID, Purpose, or Reference..." 
              className="pl-10 bg-background border-border w-full"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" className="gap-2 border-border">
            <Filter className="h-4 w-4" /> Filter By Date
          </Button>
        </div>
      </div>

      <TransactionList />
    </>
  );
};

export default Transactions;
