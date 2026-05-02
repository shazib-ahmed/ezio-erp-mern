import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';

function App() {
  return (
    <BrowserRouter>
      <ThemeSwitcher />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
