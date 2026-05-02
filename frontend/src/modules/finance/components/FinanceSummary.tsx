import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { StatsCard } from '@/shared/components/common/StatsCard';

const FinanceSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard 
        label="Total Revenue" 
        value="$245,000" 
        change="+15.2%" 
        trend="up" 
        icon={ArrowUpCircle} 
        iconColor="text-primary"
      />
      <StatsCard 
        label="Total Expenses" 
        value="$128,400" 
        change="+8.4%" 
        trend="down" 
        icon={ArrowDownCircle} 
        iconColor="text-destructive"
      />
      <StatsCard 
        label="Net Balance" 
        value="$116,600" 
        change="+22%" 
        trend="up" 
        icon={Wallet} 
        iconColor="text-blue-500"
      />
    </div>
  );
};

export { FinanceSummary };
