import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTransactions, fetchFinanceStats } from '@/modules/finance/slice/transactionSlice';
import { fetchAccounts } from '@/modules/finance/slice/accountSlice';
import { TransactionList } from '@/modules/finance/components/TransactionList';
import { FinanceSummary } from '@/modules/finance/components/FinanceSummary';
import { Button } from '@/shared/ui/button';
import { Plus, Search, FilterX } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.accounts);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [filterAccount, setFilterAccount] = useState<string>('ALL');
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Dynamically derive available payment methods from accounts
  const availableMethods = useMemo(() => {
    const methods = new Set<string>();
    if (!Array.isArray(accounts)) return [];

    accounts.forEach(acc => {
      if (acc.accountType === 'CASH') methods.add('CASH');
      if (acc.accountType === 'BANK') methods.add('BANK_TRANSFER');
      if (acc.accountType === 'MOBILE_WALLET') {
        const name = acc.name.toLowerCase();
        if (name.includes('bkash')) methods.add('BKASH');
        else if (name.includes('nagad')) methods.add('NAGAD');
        else methods.add('BKASH'); // Default to BKASH if not specified
      }
    });
    
    return Array.from(methods);
  }, [accounts]);

  useEffect(() => {
    dispatch(fetchAccounts({}));
    dispatch(fetchFinanceStats());
  }, [dispatch]);

  useEffect(() => {
    const params: any = {
      search: debouncedSearch,
    };
    
    if (filterType !== 'ALL') params.type = filterType;
    if (filterMethod !== 'ALL') params.method = filterMethod;
    if (filterAccount !== 'ALL') params.accountId = Number(filterAccount);
    
    dispatch(fetchTransactions(params));
  }, [dispatch, debouncedSearch, filterType, filterMethod, filterAccount]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('ALL');
    setFilterMethod('ALL');
    setFilterAccount('ALL');
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Bank';
      case 'BKASH': return 'bKash';
      case 'NAGAD': return 'Nagad';
      case 'CASH': return 'Cash';
      case 'CARD': return 'Card';
      default: return method;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Monitor all financial movements and history.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-11">
            Export CSV
          </Button>
          <Button className="gap-2 h-11 bg-primary font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <Plus className="h-4 w-4" /> New Transaction
          </Button>
        </div>
      </div>

      <FinanceSummary />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, purpose, type, method or amount..." 
              className="pl-10 h-11 bg-background border-border w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-11 bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-[140px] h-11 bg-background">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="ALL">All Methods</SelectItem>
                {availableMethods.map(method => (
                  <SelectItem key={method} value={method}>{getMethodLabel(method)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterAccount} onValueChange={setFilterAccount}>
              <SelectTrigger className="w-[180px] h-11 bg-background">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="ALL">All Accounts</SelectItem>
                {Array.isArray(accounts) && accounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id.toString()}>{acc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || filterType !== 'ALL' || filterMethod !== 'ALL' || filterAccount !== 'ALL') && (
              <Button 
                variant="ghost" 
                onClick={handleResetFilters}
                className="h-11 px-3 text-muted-foreground hover:text-foreground"
              >
                <FilterX className="h-4 w-4 mr-2" /> Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <TransactionList />
    </div>
  );
};

export default Transactions;
