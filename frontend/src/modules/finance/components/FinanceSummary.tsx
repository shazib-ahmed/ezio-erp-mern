import React, { useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { StatsCard } from '@/shared/components/common/StatsCard';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchFinanceStats } from '../slice/transactionSlice';
import { Skeleton } from '@/shared/ui/skeleton';

const FinanceSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchFinanceStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard 
        label="Total Revenue" 
        value={`$${Number(stats?.totalIncome || 0).toLocaleString()}`} 
        change="+0%" 
        trend="up" 
        icon={ArrowUpCircle} 
        iconColor="text-primary"
      />
      <StatsCard 
        label="Total Expenses" 
        value={`$${Number(stats?.totalExpense || 0).toLocaleString()}`} 
        change="+0%" 
        trend="down" 
        icon={ArrowDownCircle} 
        iconColor="text-destructive"
      />
      <StatsCard 
        label="Net Balance" 
        value={`$${Number(stats?.netBalance || 0).toLocaleString()}`} 
        change="+0%" 
        trend="up" 
        icon={Wallet} 
        iconColor="text-blue-500"
      />
    </div>
  );
};

export { FinanceSummary };
