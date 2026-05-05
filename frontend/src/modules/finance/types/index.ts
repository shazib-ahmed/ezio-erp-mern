export interface Transaction {
  id: number;
  trxId: string;
  amount: number | string;
  type: 'INCOME' | 'EXPENSE';
  purpose: string;
  method: 'CASH' | 'BANK_TRANSFER' | 'BKASH' | 'NAGAD' | 'CARD';
  referenceNo?: string;
  note?: string;
  createdAt: string;
  customer?: any;
  sale?: any;
  expense?: any;
}

export interface Account {
  id: number;
  name: string;
  accountType: string;
  balance: number | string;
  createdAt: string;
}

export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number | string;
  expenseDate: string;
  createdAt: string;
}
