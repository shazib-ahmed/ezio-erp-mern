import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

const stats = [
  { label: 'Total Sales', value: '$128,430', change: '+12.5%', icon: DollarSign, color: 'text-primary' },
  { label: 'Inventory Value', value: '$45,210', change: '-2.4%', icon: Package, color: 'text-orange-500' },
  { label: 'Active Orders', value: '482', change: '+18%', icon: ShoppingCart, color: 'text-blue-500' },
  { label: 'New Customers', value: '24', change: '+4.3%', icon: Users, color: 'text-purple-500' },
];

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.change.startsWith('+') ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-background border border-border`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { DashboardStats };
