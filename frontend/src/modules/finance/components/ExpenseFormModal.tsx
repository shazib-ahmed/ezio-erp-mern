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
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAccounts } from '../slice/accountSlice';
import { cn } from '@/shared/lib/utils';
import { Loader2 } from 'lucide-react';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  editData?: any;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting = false,
  editData
}) => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.accounts);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    accountId: '',
    method: 'CASH',
    referenceNo: '',
  });

  useEffect(() => {
    if (editData) {
      const mainTrx = editData.transactions?.find((t: any) => t.type === 'EXPENSE') || editData.transactions?.[0];
      
      setFormData({
        title: editData.title || '',
        category: editData.category || '',
        amount: editData.amount?.toString() || '',
        expenseDate: editData.expenseDate ? new Date(editData.expenseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        accountId: mainTrx?.accountId?.toString() || '',
        method: mainTrx?.method || 'CASH',
        referenceNo: mainTrx?.referenceNo || '',
      });
      setErrors({});
    } else {
      setFormData({
        title: '',
        category: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        accountId: '',
        method: 'CASH',
        referenceNo: '',
      });
      setErrors({});
    }
  }, [editData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAccounts({}));
    }
  }, [isOpen, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.accountId) newErrors.accountId = 'Please select a payment account';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedAccount = accounts.find(a => a.id.toString() === formData.accountId);
    let method = formData.method || 'CASH';
    
    if (selectedAccount) {
      if (selectedAccount.accountType === 'BANK') method = 'BANK_TRANSFER';
      else if (selectedAccount.accountType === 'MOBILE_WALLET') method = 'BKASH';
      else method = 'CASH';
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      accountId: parseInt(formData.accountId),
      method
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Expense Record' : 'Record New Expense'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className={cn(errors.title && "text-destructive")}>Expense Title</Label>
            <Input
              id="title"
              placeholder="e.g., Office Rent, Utility Bill"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors(prev => { const n = {...prev}; delete n.title; return n; });
              }}
              disabled={isSubmitting}
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && <p className="text-[12px] text-destructive font-medium">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className={cn(errors.category && "text-destructive")}>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => {
                  setFormData({ ...formData, category: val });
                  if (errors.category) setErrors(prev => { const n = {...prev}; delete n.category; return n; });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className={cn(errors.category && "border-destructive")}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Rent">Rent & Lease</SelectItem>
                  <SelectItem value="Utilities">Utilities (Gas, Water, Elec)</SelectItem>
                  <SelectItem value="Salary">Salary & Wages</SelectItem>
                  <SelectItem value="Inventory">Inventory Purchase</SelectItem>
                  <SelectItem value="Marketing">Marketing & Ads</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Travel">Travel & Transport</SelectItem>
                  <SelectItem value="Maintenance">Maintenance & Repair</SelectItem>
                  <SelectItem value="Software">Software & Subscriptions</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Taxes">Taxes & Licenses</SelectItem>
                  <SelectItem value="Other">Other Expenses</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-[12px] text-destructive font-medium">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className={cn(errors.amount && "text-destructive")}>Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) setErrors(prev => { const n = {...prev}; delete n.amount; return n; });
                }}
                disabled={isSubmitting}
                className={cn(errors.amount && "border-destructive")}
              />
              {errors.amount && <p className="text-[12px] text-destructive font-medium">{errors.amount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseDate">Date</Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountId" className={cn(errors.accountId && "text-destructive")}>Pay From Account</Label>
              <Select 
                value={formData.accountId} 
                onValueChange={(val) => {
                  setFormData({ ...formData, accountId: val });
                  if (errors.accountId) setErrors(prev => { const n = {...prev}; delete n.accountId; return n; });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className={cn(errors.accountId && "border-destructive")}>
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Array.isArray(accounts) && accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.name} (${Number(acc.balance).toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-[12px] text-destructive font-medium">{errors.accountId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNo">Reference No (Optional)</Label>
            <Input
              id="referenceNo"
              placeholder="Check No / Trx ID"
              value={formData.referenceNo}
              onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Save Changes' : 'Record Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ExpenseFormModal };
