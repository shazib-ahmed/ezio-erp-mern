import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { fetchAccounts, createAccount, updateAccount } from '@/modules/finance/slice/accountSlice';
import { Button } from '@/shared/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import { AccountList } from '@/modules/finance/components/AccountList';
import { AccountFormModal } from '@/modules/finance/components/AccountFormModal';
import { useDebounce } from '@/shared/hooks/useDebounce';

const Accounts: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchAccounts({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  const handleOpenModal = (account: any = null) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedAccount) {
        await dispatch(updateAccount({ id: selectedAccount.id, data })).unwrap();
        toast.success('Account updated successfully');
      } else {
        await dispatch(createAccount(data)).unwrap();
        toast.success('Account created successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Operation failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts and digital wallets.</p>
        </div>
        
        <Button className="gap-2 h-11 bg-primary px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={() => handleOpenModal()}>
          <Plus className="h-5 w-5" /> Add Account
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search accounts by name or type..." 
            className="pl-10 h-11 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <AccountList onEdit={handleOpenModal} />

      <AccountFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedAccount}
      />
    </div>
  );
};

export default Accounts;
