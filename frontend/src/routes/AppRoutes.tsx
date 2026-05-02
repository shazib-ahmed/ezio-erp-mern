import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import { DashboardSkeleton } from '@/shared/components/skeletons/DashboardSkeleton';
import { TableSkeleton } from '@/shared/components/skeletons/TableSkeleton';

const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
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

const Tenants = lazy(() => import('@/pages/admin/Tenants'));
const Industries = lazy(() => import('@/pages/admin/Industries'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Internal Routes */}
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        } 
      />
      <Route 
        path="/inventory" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Inventory />
          </Suspense>
        } 
      />
      <Route 
        path="/finance/ledger" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Ledger />
          </Suspense>
        } 
      />
      <Route 
        path="/finance/accounts" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Accounts />
          </Suspense>
        } 
      />
      <Route 
        path="/finance/payable-receivable" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <PayableReceivable />
          </Suspense>
        } 
      />
      <Route 
        path="/finance/assets" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Assets />
          </Suspense>
        } 
      />
      <Route 
        path="/finance/tax" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Tax />
          </Suspense>
        } 
      />
      <Route 
        path="/finance/reports" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Reports />
          </Suspense>
        } 
      />

      <Route 
        path="/hrm/employees" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Employees />
          </Suspense>
        } 
      />
      <Route 
        path="/hrm/attendance" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Attendance />
          </Suspense>
        } 
      />
      <Route 
        path="/hrm/leave" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <LeaveManagement />
          </Suspense>
        } 
      />
      <Route 
        path="/hrm/payroll" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Payroll />
          </Suspense>
        } 
      />
      <Route 
        path="/hrm/roles" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <RolesPermissions />
          </Suspense>
        } 
      />
      <Route 
        path="/hrm/documents" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <DocumentVault />
          </Suspense>
        } 
      />

      {/* Sales Routes */}
      <Route 
        path="/sales/quotations" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Quotations />
          </Suspense>
        } 
      />
      <Route 
        path="/sales/orders" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Orders />
          </Suspense>
        } 
      />
      <Route 
        path="/sales/pos" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <POS />
          </Suspense>
        } 
      />
      <Route 
        path="/sales/customers" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Customers />
          </Suspense>
        } 
      />
      <Route 
        path="/sales/returns" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Returns />
          </Suspense>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <SettingsPage />
          </Suspense>
        } 
      />

      {/* Super Admin Routes */}
      <Route 
        path="/admin/tenants" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Tenants />
          </Suspense>
        } 
      />
      <Route 
        path="/admin/industries" 
        element={
          <Suspense fallback={<TableSkeleton />}>
            <Industries />
          </Suspense>
        } 
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/finance" element={<Navigate to="/finance/ledger" replace />} />
      <Route path="/hrm" element={<Navigate to="/hrm/employees" replace />} />
      <Route path="/sales" element={<Navigate to="/sales/orders" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/tenants" replace />} />
    </Routes>
  );
};

export default AppRoutes;
