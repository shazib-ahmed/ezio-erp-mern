import React from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { StatsCard } from '@/shared/components/common/StatsCard';

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        label="Total Sales" 
        value="$128,430" 
        change="+12.5%" 
        trend="up" 
        icon={DollarSign} 
      />
      <StatsCard 
        label="Inventory Value" 
        value="$45,210" 
        change="-2.4%" 
        trend="down" 
        icon={Package} 
        iconColor="text-orange-500"
      />
      <StatsCard 
        label="Active Orders" 
        value="482" 
        change="+18%" 
        trend="up" 
        icon={ShoppingCart} 
        iconColor="text-blue-500"
      />
      <StatsCard 
        label="New Customers" 
        value="24" 
        change="+4.3%" 
        trend="up" 
        icon={Users} 
        iconColor="text-purple-500"
      />
    </div>
  );
};

export { DashboardStats };
