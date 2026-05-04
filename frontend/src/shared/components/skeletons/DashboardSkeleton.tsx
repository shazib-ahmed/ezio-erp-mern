import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 bg-muted/50" />
          <Skeleton className="h-4 w-80 bg-muted/50" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-28 rounded-lg bg-muted/50" />
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-xl border border-border bg-card/50 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-10 rounded-xl bg-muted/50" />
              <Skeleton className="h-6 w-12 rounded-full bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-muted/50" />
              <Skeleton className="h-8 w-32 bg-muted/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card/50 h-[400px] flex flex-col gap-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 bg-muted/50" />
              <Skeleton className="h-4 w-64 bg-muted/50" />
            </div>
            <Skeleton className="h-10 w-32 bg-muted/50" />
          </div>
          <Skeleton className="flex-1 w-full bg-muted/20 rounded-xl" />
        </div>
        <div className="p-6 rounded-xl border border-border bg-card/50 h-[400px] flex flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-muted/50" />
            <Skeleton className="h-4 w-48 bg-muted/50" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full bg-muted/30 border-8 border-muted/10" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card/50 h-[350px] space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40 bg-muted/50" />
            <Skeleton className="h-6 w-20 bg-muted/50" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-muted/50" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 bg-muted/50" />
                    <Skeleton className="h-3 w-48 bg-muted/50" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 bg-muted/50" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card/50 h-[350px] overflow-hidden flex flex-col">
          <div className="p-6 flex justify-between items-center border-b border-border/50">
            <Skeleton className="h-6 w-40 bg-muted/50" />
            <Skeleton className="h-8 w-24 bg-muted/50" />
          </div>
          <div className="flex-1 p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-40 bg-muted/50" />
                <Skeleton className="h-4 w-16 bg-muted/50" />
                <Skeleton className="h-6 w-20 bg-muted/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
