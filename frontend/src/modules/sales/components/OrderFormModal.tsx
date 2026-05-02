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

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderNo: '',
    date: new Date().toISOString().split('T')[0],
    totalAmount: '',
    paymentStatus: 'Unpaid',
    deliveryStatus: 'Pending'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        customerName: '',
        orderNo: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        totalAmount: '',
        paymentStatus: 'Unpaid',
        deliveryStatus: 'Pending'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Sales Order' : 'New Sales Order'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="customerName">Customer</Label>
              <Input 
                id="customerName" 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleChange} 
                placeholder="Select Customer" 
                required 
                className="bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderNo">Order No</Label>
              <Input 
                id="orderNo" 
                name="orderNo" 
                value={formData.orderNo} 
                readOnly
                className="bg-muted border-border cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Order Date</Label>
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
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select onValueChange={(v) => handleSelectChange('paymentStatus', v)} value={formData.paymentStatus}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status</Label>
              <Select onValueChange={(v) => handleSelectChange('deliveryStatus', v)} value={formData.deliveryStatus}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Delivery" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="totalAmount">Order Total ($)</Label>
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
            <Button type="submit">{initialData ? 'Update Order' : 'Create Order'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { OrderFormModal };
