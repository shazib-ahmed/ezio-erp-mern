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
import { Pencil, Trash2, Wallet, Building2, Smartphone } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAccounts, deleteAccount } from '../slice/accountSlice';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from 'sonner';
import { DeleteConfirmationModal } from '@/shared/components/modals/DeleteConfirmationModal';

interface AccountListProps {
  onEdit: (account: any) => void;
}

const AccountList: React.FC<AccountListProps> = ({ onEdit }) => {
  const dispatch = useAppDispatch();
  const { accounts, loading } = useAppSelector((state) => state.accounts);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAccounts({}));
  }, [dispatch]);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'BANK': return <Building2 className="h-4 w-4 text-primary" />;
      case 'MOBILE_WALLET': return <Smartphone className="h-4 w-4 text-primary" />;
      default: return <Wallet className="h-4 w-4 text-primary" />;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteAccount(deleteId)).unwrap();
      toast.success('Account and all associated transactions deleted');
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
              <TableHead className="font-bold">Account Name</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Balance</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && accounts.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No accounts found.
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(accounts) && accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      {getAccountIcon(account.accountType)}
                      {account.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50 border-border">
                      {account.accountType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ${Number(account.balance).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onEdit(account)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(account.id)}
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
        title="Delete Account?"
        description="This will permanently delete the account and ALL associated transactions (expenses, incomes, etc.). This action cannot be undone."
      />
    </>
  );
};

export { AccountList };
