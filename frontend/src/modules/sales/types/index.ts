export interface Quotation {
  id: number;
  quotationNo: string;
  customerName: string;
  date: string;
  expiryDate: string;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
}

export interface SalesOrder {
  id: number;
  orderNo: string;
  customerName: string;
  date: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  deliveryStatus: 'Pending' | 'Shipped' | 'Delivered';
}

export interface CustomerCredit {
  id: number;
  customerName: string;
  creditLimit: number;
  totalDue: number;
  lastPaymentDate: string;
  status: 'Good' | 'Warning' | 'Blocked';
}

export interface SaleReturn {
  id: number;
  returnNo: string;
  orderNo: string;
  customerName: string;
  date: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Completed';
}
