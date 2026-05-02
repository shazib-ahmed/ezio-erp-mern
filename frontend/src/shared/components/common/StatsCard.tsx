import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = 'text-primary'
}) => {
  return (
    <Card className="border-border/40">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{value}</h3>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={trend === 'up' ? 'text-primary' : 'text-destructive'}>
                  {change}
                </span>
                <span className="text-muted-foreground text-xs ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-background border border-border">
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { StatsCard };
