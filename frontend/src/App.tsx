import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { initializeAuth } from '@/core/auth/slice/authSlice';
import { Loader2 } from 'lucide-react';

function App() {
  const dispatch = useAppDispatch();
  const { isInitializing } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
