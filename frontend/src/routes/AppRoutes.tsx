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

const Employees = lazy(() => import('@/pages/hrm/Employees'));
const Attendance = lazy(() => import('@/pages/hrm/Attendance'));
const LeaveManagement = lazy(() => import('@/pages/hrm/LeaveManagement'));
const Payroll = lazy(() => import('@/pages/hrm/Payroll'));
const RolesPermissions = lazy(() => import('@/pages/hrm/RolesPermissions'));
const DocumentVault = lazy(() => import('@/pages/hrm/DocumentVault'));

const Quotations = lazy(() => import('@/pages/sales/Quotations'));
const Orders = lazy(() => import('@/pages/sales/Orders'));
const POS = lazy(() => import('@/pages/sales/POS'));
const Customers = lazy(() => import('@/pages/sales/Customers'));
const Returns = lazy(() => import('@/pages/sales/Returns'));
const SettingsPage = lazy(() => import('@/pages/settings/Settings'));

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

      <Route 
        path="/hrm/employees" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Employees />
          </React.Suspense>
        } 
      />
      <Route 
        path="/hrm/attendance" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Attendance />
          </React.Suspense>
        } 
      />
      <Route 
        path="/hrm/leave" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <LeaveManagement />
          </React.Suspense>
        } 
      />
      <Route 
        path="/hrm/payroll" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Payroll />
          </React.Suspense>
        } 
      />
      <Route 
        path="/hrm/roles" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <RolesPermissions />
          </React.Suspense>
        } 
      />
      <Route 
        path="/hrm/documents" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <DocumentVault />
          </React.Suspense>
        } 
      />

      {/* Sales Routes */}
      <Route 
        path="/sales/quotations" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Quotations />
          </React.Suspense>
        } 
      />
      <Route 
        path="/sales/orders" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Orders />
          </React.Suspense>
        } 
      />
      <Route 
        path="/sales/pos" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <POS />
          </React.Suspense>
        } 
      />
      <Route 
        path="/sales/customers" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Customers />
          </React.Suspense>
        } 
      />
      <Route 
        path="/sales/returns" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <Returns />
          </React.Suspense>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <SettingsPage />
          </React.Suspense>
        } 
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/finance" element={<Navigate to="/finance/ledger" replace />} />
      <Route path="/hrm" element={<Navigate to="/hrm/employees" replace />} />
      <Route path="/sales" element={<Navigate to="/sales/orders" replace />} />
    </Routes>
  );
};

export default AppRoutes;
