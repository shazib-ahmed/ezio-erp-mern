import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface CardSkeletonProps {
  count?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="border-border bg-card shadow-none overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-3/4 mb-2" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
