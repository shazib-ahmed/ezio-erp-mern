import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { initializeAuth } from '@/core/auth/slice/authSlice';
import { Skeleton } from '@/shared/ui/skeleton';

import PageTitleUpdater from '@/shared/components/common/PageTitleUpdater';

function App() {
  const dispatch = useAppDispatch();
  const { isInitializing } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Sidebar Skeleton */}
        <div className="w-64 border-r border-border p-6 hidden md:block">
          <Skeleton className="h-8 w-32 mb-10" />
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Content area Skeleton */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          
          <Skeleton className="h-32 w-full rounded-xl mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
