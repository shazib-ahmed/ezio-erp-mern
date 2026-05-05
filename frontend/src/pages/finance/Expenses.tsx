import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchExpenses, createExpense, updateExpense } from '@/modules/finance/slice/expenseSlice';
import { fetchAccounts } from '@/modules/finance/slice/accountSlice';
import { Button } from '@/shared/ui/button';
import { Plus, Search, FilterX } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import { ExpenseList } from '@/modules/finance/components/ExpenseList';
import { ExpenseFormModal } from '@/modules/finance/components/ExpenseFormModal';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';

const Expenses: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.expenses);
  const { accounts } = useAppSelector((state) => state.accounts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterAccount, setFilterAccount] = useState<string>('ALL');
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchAccounts({}));
  }, [dispatch]);

  useEffect(() => {
    const params: any = {
      search: debouncedSearch,
    };
    
    if (filterCategory !== 'ALL') params.category = filterCategory;
    if (filterAccount !== 'ALL') params.accountId = Number(filterAccount);
    
    dispatch(fetchExpenses(params));
  }, [dispatch, debouncedSearch, filterCategory, filterAccount]);

  const handleOpenModal = (expense: any = null) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedExpense) {
        await dispatch(updateExpense({ id: selectedExpense.id, data })).unwrap();
        toast.success('Expense updated successfully');
      } else {
        await dispatch(createExpense(data)).unwrap();
        toast.success('Expense created successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCategory('ALL');
    setFilterAccount('ALL');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your business expenditures.</p>
        </div>
        
        <Button className="gap-2 h-11 bg-primary px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={() => handleOpenModal()}>
          <Plus className="h-5 w-5" /> Add Expense
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search expenses by title or category..." 
              className="pl-10 h-11 bg-background border-border w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] h-11 bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="Rent">Rent & Lease</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Salary">Salary & Wages</SelectItem>
                <SelectItem value="Inventory">Inventory Purchase</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Travel">Travel & Transport</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Software">Software & Subscriptions</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Taxes">Taxes & Licenses</SelectItem>
                <SelectItem value="Other">Other Expenses</SelectItem>
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

            {(searchQuery || filterCategory !== 'ALL' || filterAccount !== 'ALL') && (
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

      <ExpenseList onEdit={handleOpenModal} />

      <ExpenseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Expenses;
