import React, { useState, useEffect } from 'react';
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
import { cn } from '@/shared/lib/utils';
import { Loader2 } from 'lucide-react';
import { useCurrency } from '@/shared/hooks/useCurrency';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  initialData?: any;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting = false,
  initialData
}) => {
  const { currencySymbol } = useCurrency();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    accountType: '',
    balance: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        accountType: initialData.accountType || '',
        balance: initialData.balance?.toString() || '0',
      });
      setErrors({});
    } else {
      setFormData({ name: '', accountType: '', balance: '' });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Account name is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';
    if (!formData.balance) newErrors.balance = 'Initial balance is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      balance: parseFloat(formData.balance || '0'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Account' : 'Add New Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(errors.name && "text-destructive")}>Account Name</Label>
            <Input
              id="name"
              placeholder="e.g., Business Cash, Bank Asia"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors(prev => { const n = {...prev}; delete n.name; return n; });
              }}
              disabled={isSubmitting}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-[12px] text-destructive font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className={cn(errors.accountType && "text-destructive")}>Account Type</Label>
            <Select 
              value={formData.accountType} 
              onValueChange={(val) => {
                setFormData({ ...formData, accountType: val });
                if (errors.accountType) setErrors(prev => { const n = {...prev}; delete n.accountType; return n; });
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className={cn(errors.accountType && "border-destructive")}>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BANK">Bank Account</SelectItem>
                <SelectItem value="MOBILE_WALLET">Mobile Wallet (Bkash/Nagad)</SelectItem>
              </SelectContent>
            </Select>
            {errors.accountType && <p className="text-[12px] text-destructive font-medium">{errors.accountType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className={cn(errors.balance && "text-destructive")}>
              {initialData ? 'Account Balance' : 'Initial Balance'} ({currencySymbol})
            </Label>
            <Input
              id="balance"
              type="number"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => {
                setFormData({ ...formData, balance: e.target.value });
                if (errors.balance) setErrors(prev => { const n = {...prev}; delete n.balance; return n; });
              }}
              disabled={isSubmitting}
              className={cn(errors.balance && "border-destructive")}
            />
            {errors.balance && <p className="text-[12px] text-destructive font-medium">{errors.balance}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AccountFormModal };
