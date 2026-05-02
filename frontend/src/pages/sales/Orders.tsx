import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ShoppingBag, Truck, CheckCircle2, MoreVertical } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { OrderFormModal } from '@/modules/sales/components/OrderFormModal';

const orders = [
  { id: 1, ono: 'ORD-2026-102', customer: 'Global Industries', date: '2026-05-02', total: 12500, payment: 'Paid', delivery: 'Shipped' },
  { id: 2, ono: 'ORD-2026-103', customer: 'Apex Solutions', date: '2026-05-02', total: 4200, payment: 'Partial', delivery: 'Pending' },
];

const Orders: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateOrder = (data: any) => {
    console.log('Creating sales order:', data);
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground">Track order processing, payments, and delivery status.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <ShoppingBag className="h-4 w-4" /> New Order
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Order No</TableHead>
              <TableHead className="font-bold">Customer</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold text-right">Total Amount</TableHead>
              <TableHead className="font-bold">Payment</TableHead>
              <TableHead className="font-bold">Delivery</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-bold text-foreground">{o.ono}</TableCell>
                <TableCell className="font-semibold">{o.customer}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                <TableCell className="text-right font-bold">${o.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-medium",
                    o.payment === 'Paid' && "border-primary/20 text-primary bg-primary/5",
                    o.payment === 'Partial' && "border-orange-500/20 text-orange-500 bg-orange-500/5"
                  )}>
                    {o.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {o.delivery === 'Shipped' ? <Truck className="h-4 w-4 text-blue-500" /> : <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">{o.delivery}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <OrderFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrder}
      />
    </MainLayout>
  );
};

export default Orders;
