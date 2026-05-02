import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Dashboard from '@/pages/dashboard/Dashboard';
const Inventory = lazy(() => import('@/pages/inventory/Inventory'));
const Ledger = lazy(() => import('@/pages/finance/Ledger'));
const Accounts = lazy(() => import('@/pages/finance/Accounts'));
const PayableReceivable = lazy(() => import('@/pages/finance/PayableReceivable'));
const Assets = lazy(() => import('@/pages/finance/Assets'));
const Tax = lazy(() => import('@/pages/finance/Tax'));
const Reports = lazy(() => import('@/pages/finance/Reports'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Internal Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route 
        path="/inventory" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Inventory />
          </React.Suspense>
        } 
      />
      <Route 
        path="/finance/ledger" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Ledger />
          </React.Suspense>
        } 
      />
      <Route 
        path="/finance/accounts" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Accounts />
          </React.Suspense>
        } 
      />
      <Route 
        path="/finance/payable-receivable" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <PayableReceivable />
          </React.Suspense>
        } 
      />
      <Route 
        path="/finance/assets" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Assets />
          </React.Suspense>
        } 
      />
      <Route 
        path="/finance/tax" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Tax />
          </React.Suspense>
        } 
      />
      <Route 
        path="/finance/reports" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Reports />
          </React.Suspense>
        } 
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/finance" element={<Navigate to="/finance/ledger" replace />} />
    </Routes>
  );
};

export default AppRoutes;
