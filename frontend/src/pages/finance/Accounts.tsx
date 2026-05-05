import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { AccountList } from '@/modules/finance/components/AccountList';
import { AccountFormModal } from '@/modules/finance/components/AccountFormModal';
import { Button } from '@/shared/ui/button';
import { Plus, Download, Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';

const Accounts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateAccount = (data: any) => {
    console.log('Creating account:', data);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground">Manage your Bank, Cash, and Mobile banking accounts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Account
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by account name or provider..." 
              className="bg-background border-border pl-10"
            />
          </div>
        </div>
      </div>

      <AccountList />

      <AccountFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateAccount}
      />
    </>
  );
};

export default Accounts;
