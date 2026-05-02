import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank',
    accountNumber: '',
    bankName: '',
    balance: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        type: 'Bank',
        accountNumber: '',
        bankName: '',
        balance: '',
        status: 'Active'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Account' : 'Add New Account'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Account Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Dutch Bangla Bank" 
                required 
                className="bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Account Type</Label>
              <Select onValueChange={handleSelectChange} value={formData.type}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Bank">Bank Account</SelectItem>
                  <SelectItem value="Cash">Cash / Petty Cash</SelectItem>
                  <SelectItem value="Mobile">Mobile Banking (bKash/Nagad)</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Initial Balance ($)</Label>
              <Input 
                id="balance" 
                name="balance" 
                type="number"
                value={formData.balance} 
                onChange={handleChange} 
                placeholder="0.00" 
                required 
                className="bg-background border-border"
              />
            </div>

            {formData.type !== 'Cash' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank/Provider Name</Label>
                  <Input 
                    id="bankName" 
                    name="bankName" 
                    value={formData.bankName} 
                    onChange={handleChange} 
                    placeholder="e.g. DBBL or bKash" 
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input 
                    id="accountNumber" 
                    name="accountNumber" 
                    value={formData.accountNumber} 
                    onChange={handleChange} 
                    placeholder="Account or Phone number" 
                    className="bg-background border-border"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Account' : 'Create Account'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AccountFormModal };
