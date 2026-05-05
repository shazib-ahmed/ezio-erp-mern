import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { ExpenseList } from '@/modules/finance/components/ExpenseList';
import { ExpenseFormModal } from '@/modules/finance/components/ExpenseFormModal';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  fetchExpenses, 
  createExpense, 
  updateExpense 
} from '@/modules/finance/slice/expenseSlice';
import { fetchAccounts } from '@/modules/finance/slice/accountSlice';
import { toast } from 'sonner';

const Expenses: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.expenses);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState<any>(null);

  const handleOpenModal = (expense?: any) => {
    setEditExpenseData(expense || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditExpenseData(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch(fetchExpenses({ search: e.target.value }));
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editExpenseData) {
        await dispatch(updateExpense({ id: editExpenseData.id, data })).unwrap();
        toast.success('Expense updated successfully');
      } else {
        await dispatch(createExpense(data)).unwrap();
        toast.success('Expense recorded successfully');
      }
      handleCloseModal();
      dispatch(fetchExpenses());
      dispatch(fetchAccounts({}));
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track and manage business expenditures.</p>
        </div>
        
        <Button onClick={() => handleOpenModal()} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Record Expense
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search expenses..." 
              className="pl-10 bg-background border-border w-full"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <ExpenseList onEdit={handleOpenModal} />
      
      <ExpenseFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        editData={editExpenseData}
      />
    </>
  );
};

export default Expenses;
