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

interface QuotationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const QuotationFormModal: React.FC<QuotationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    quotationNo: '',
    date: new Date().toISOString().split('T')[0],
    expiryDate: '',
    totalAmount: '',
    status: 'Draft'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        customerName: '',
        quotationNo: `QTN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        expiryDate: '',
        totalAmount: '',
        status: 'Draft'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Quotation' : 'Create New Quotation'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input 
                id="customerName" 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleChange} 
                placeholder="e.g. Global Industries" 
                required 
                className="bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quotationNo">Quotation No</Label>
              <Input 
                id="quotationNo" 
                name="quotationNo" 
                value={formData.quotationNo} 
                readOnly
                className="bg-muted border-border cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={handleSelectChange} value={formData.status}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Quotation Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date"
                value={formData.date} 
                onChange={handleChange} 
                required 
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate" 
                name="expiryDate" 
                type="date"
                value={formData.expiryDate} 
                onChange={handleChange} 
                required 
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="totalAmount">Total Estimated Amount ($)</Label>
              <Input 
                id="totalAmount" 
                name="totalAmount" 
                type="number"
                value={formData.totalAmount} 
                onChange={handleChange} 
                placeholder="0.00" 
                required 
                className="bg-background border-border"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Quotation' : 'Create Quotation'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { QuotationFormModal };
