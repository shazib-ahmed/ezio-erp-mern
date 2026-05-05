import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Pencil, Trash2, Calendar, Tag, CreditCard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchExpenses, deleteExpense } from '../slice/expenseSlice';
import { fetchAccounts } from '../slice/accountSlice';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';
import { useCurrency } from '@/shared/hooks/useCurrency';

interface ExpenseListProps {
  onEdit: (expense: any) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit }) => {
  const dispatch = useAppDispatch();
  const { expenses, loading } = useAppSelector((state) => state.expenses);
  const { formatCurrency } = useCurrency();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchExpenses({}));
  }, [dispatch]);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteExpense(deleteId)).unwrap();
      toast.success('Expense deleted and balance restored');
      dispatch(fetchAccounts({})); // Refresh accounts to show restored balance
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Date & Title</TableHead>
              <TableHead className="font-bold">Trx ID</TableHead>
              <TableHead className="font-bold">Account</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && expenses.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No expenses found.
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(expenses) && expenses.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{item.title}</span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.expenseDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 font-mono w-fit">
                      {item.transactions?.[0]?.trxId || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[11px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded border border-border w-fit">
                      <CreditCard className="h-3 w-3" />
                      {item.transactions?.[0]?.account?.name || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50 border-border text-[11px] py-0.5 px-2 gap-1.5 font-medium inline-flex items-center">
                      <Tag className="h-3 w-3 text-primary/70" />
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-bold text-destructive">
                      -{formatCurrency(item.amount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Expense?"
        description="This will permanently delete the expense record. The amount will be credited back to your account balance."
      />
    </>
  );
};

export { ExpenseList };
