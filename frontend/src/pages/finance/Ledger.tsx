import React from 'react';
import { FinanceSummary } from '@/modules/finance/components/FinanceSummary';
import { TransactionList } from '@/modules/finance/components/TransactionList';
import { Button } from '@/shared/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { Input } from '@/shared/ui/input';

const Ledger: React.FC = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">General Ledger</h1>
          <p className="text-muted-foreground">Daily record of all financial transactions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Ledger
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Entry
          </Button>
        </div>
      </div>

      <FinanceSummary />

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Input 
              placeholder="Search ledger entries..." 
              className="bg-background border-border"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Date Range
          </Button>
        </div>
      </div>

      <TransactionList />
    </>
  );
};

export default Ledger;
