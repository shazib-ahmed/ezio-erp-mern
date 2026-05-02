export interface Transaction {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  status: 'Completed' | 'Pending';
}
export interface Account {
  id: number;
  name: string;
  type: 'Bank' | 'Cash' | 'Mobile' | 'Other';
  accountNumber?: string;
  bankName?: string;
  balance: number;
  status: 'Active' | 'Inactive';
}
