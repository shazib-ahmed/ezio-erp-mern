import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  ShoppingCart, 
  Plus, 
  ArrowUpRight, 
  Clock,
  Package,
  Wallet,
  Building2,
  Tag
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';
import { useAppSelector } from '@/app/hooks';

const trendData = [
  { name: '01 May', sales: 4000, expenses: 2400 },
  { name: '05 May', sales: 3000, expenses: 1398 },
  { name: '10 May', sales: 2000, expenses: 9800 },
  { name: '15 May', sales: 2780, expenses: 3908 },
  { name: '20 May', sales: 1890, expenses: 4800 },
  { name: '25 May', sales: 2390, expenses: 3800 },
  { name: '30 May', sales: 3490, expenses: 4300 },
];

const paymentData = [
  { name: 'Cash', value: 60, color: '#10b981' },
  { name: 'bKash', value: 25, color: '#ec4899' },
  { name: 'Bank', value: 15, color: '#3b82f6' },
];

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.roles?.some((r: any) => r.role.name === 'SUPER_ADMIN');

  if (isSuperAdmin) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">System Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here's the platform status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-border bg-card shadow-none overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">Active</Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Tenants</p>
              <h3 className="text-2xl font-bold text-foreground">12</h3>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-none overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Tag className="h-5 w-5 text-indigo-500" />
                </div>
                <Badge variant="outline" className="bg-indigo-500/5 text-indigo-500 border-indigo-500/10">System</Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Industries</p>
              <h3 className="text-2xl font-bold text-foreground">27</h3>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2 bg-primary shadow-none h-11" size="sm">
            <Plus className="h-4 w-4" /> New Sale
          </Button>
          <Button variant="outline" className="gap-2 border-border h-11" size="sm">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
          <Button variant="outline" className="gap-2 border-border h-11" size="sm">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
          <Button variant="outline" className="gap-2 border-border h-11" size="sm">
            <Package className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* 1. KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border bg-card shadow-none overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/10">+12.5%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
            <h3 className="text-2xl font-bold text-foreground">$45,280.00</h3>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <TrendingDown className="h-5 w-5 text-rose-500" />
              </div>
              <Badge variant="outline" className="bg-rose-500/5 text-rose-500 border-rose-500/10">+4.2%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-foreground">$12,450.00</h3>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <DollarSign className="h-5 w-5 text-indigo-500" />
              </div>
              <Badge variant="outline" className="bg-indigo-500/5 text-indigo-500 border-indigo-500/10">+8.1%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Net Profit</p>
            <h3 className="text-2xl font-bold text-foreground">$32,830.00</h3>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Wallet className="h-5 w-5 text-amber-500" />
              </div>
              <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/10">Action Required</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Receivables</p>
            <h3 className="text-2xl font-bold text-foreground">$8,940.00</h3>
          </CardContent>
        </Card>
      </div>

      {/* Middle Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 2. Sales vs Expense Chart */}
        <Card className="lg:col-span-2 border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
            <div>
              <CardTitle className="text-lg font-bold">Sales vs Expenses</CardTitle>
              <p className="text-sm text-muted-foreground">Cash flow trend over the last 30 days</p>
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="w-[140px] bg-background border-border h-9 text-xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-6 pt-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Revenue by Payment Method */}
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-lg font-bold">Payment Methods</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue distribution by channel</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Operational Alerts */}
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-none">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" /> Operational Alerts
                </CardTitle>
                <Badge variant="outline" className="border-border">4 Pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-rose-500" />
                  <div>
                    <p className="text-sm font-bold">Low Stock: Industrial Motor</p>
                    <p className="text-xs text-muted-foreground">Only 3 units remaining in main warehouse.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8 border-rose-500/20 text-rose-500 hover:bg-rose-500/10">Restock</Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold">Due: Global Industries</p>
                    <p className="text-xs text-muted-foreground">$12,500 overdue by 3 days.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8 border-amber-500/20 text-amber-500 hover:bg-amber-500/10">Remind</Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold">8 Pending Orders</p>
                    <p className="text-xs text-muted-foreground">Orders awaiting processing or delivery.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8 border-blue-500/20 text-blue-500 hover:bg-blue-500/10">View</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. Recent Transactions */}
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary gap-1 font-bold">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold pl-6">Purpose</TableHead>
                  <TableHead className="font-bold text-right">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 1, purpose: 'Sales: Global Industries', amount: '+ $12,500', status: 'Completed', type: 'sale' },
                  { id: 2, purpose: 'Expense: Warehouse Rent', amount: '- $2,400', status: 'Pending', type: 'expense' },
                  { id: 3, purpose: 'Sales: Apex Solutions', amount: '+ $4,200', status: 'Completed', type: 'sale' },
                  { id: 4, purpose: 'Expense: Electricity Bill', amount: '- $850', status: 'Completed', type: 'expense' },
                  { id: 5, purpose: 'Sales: Tech Corp', amount: '+ $890', status: 'Cancelled', type: 'sale' },
                ].map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/20">
                    <TableCell className="pl-6 font-semibold py-4">{tx.purpose}</TableCell>
                    <TableCell className={cn(
                      "text-right font-bold",
                      tx.type === 'sale' ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {tx.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold",
                        tx.status === 'Completed' && "bg-emerald-500/5 text-emerald-500 border-emerald-500/10",
                        tx.status === 'Pending' && "bg-amber-500/5 text-amber-500 border-amber-500/10",
                        tx.status === 'Cancelled' && "bg-rose-500/5 text-rose-500 border-rose-500/10"
                      )}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
