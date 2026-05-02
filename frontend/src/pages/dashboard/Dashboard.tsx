import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { DashboardStats } from '@/modules/dashboard/components/DashboardStats';
import { Card, CardContent } from '@/shared/ui/card';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance.</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Low Stock Alerts</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Package className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Industrial Motor X1</p>
                      <p className="text-sm text-muted-foreground">SKU: IND-MOT-00{i}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">5 units left</p>
                    <p className="text-xs text-muted-foreground">Min level: 15</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-6">Business Growth</h3>
            <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
               <p className="text-muted-foreground italic">Chart will be integrated here (using Recharts)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
