import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardSkeleton } from '@/shared/components/skeletons/DashboardSkeleton';
import { TableSkeleton } from '@/shared/components/skeletons/TableSkeleton';
import ProtectedRoute from './ProtectedRoute';

// Lazy load components
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Inventory = lazy(() => import('@/pages/inventory/Inventory'));
const Ledger = lazy(() => import('@/pages/finance/Ledger'));
const Accounts = lazy(() => import('@/pages/finance/Accounts'));
const PayableReceivable = lazy(() => import('@/pages/finance/PayableReceivable'));
const Assets = lazy(() => import('@/pages/finance/Assets'));
const Tax = lazy(() => import('@/pages/finance/Tax'));
const FinanceReports = lazy(() => import('@/pages/finance/Reports'));
const Quotations = lazy(() => import('@/pages/sales/Quotations'));
const Orders = lazy(() => import('@/pages/sales/Orders'));
const POS = lazy(() => import('@/pages/sales/POS'));
const Customers = lazy(() => import('@/pages/sales/Customers'));
const Returns = lazy(() => import('@/pages/sales/Returns'));
const Employees = lazy(() => import('@/pages/hrm/Employees'));
const Attendance = lazy(() => import('@/pages/hrm/Attendance'));
const Leave = lazy(() => import('@/pages/hrm/LeaveManagement'));
const Payroll = lazy(() => import('@/pages/hrm/Payroll'));
const Roles = lazy(() => import('@/pages/hrm/RolesPermissions'));
const Documents = lazy(() => import('@/pages/hrm/DocumentVault'));
const SettingsPage = lazy(() => import('@/pages/settings/Settings'));
const Tenants = lazy(() => import('@/pages/admin/Tenants'));
const Industries = lazy(() => import('@/pages/admin/Industries'));
const LoginPage = lazy(() => import('@/pages/auth/Login'));
const SignupPage = lazy(() => import('@/pages/auth/Signup'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <LoginPage />
          </Suspense>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <SignupPage />
          </Suspense>
        } 
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
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

        {/* Finance Sub-routes */}
        <Route path="/finance">
          <Route index element={<Navigate to="/finance/ledger" replace />} />
          <Route path="ledger" element={<Suspense fallback={<TableSkeleton />}><Ledger /></Suspense>} />
          <Route path="accounts" element={<Suspense fallback={<TableSkeleton />}><Accounts /></Suspense>} />
          <Route path="payable-receivable" element={<Suspense fallback={<TableSkeleton />}><PayableReceivable /></Suspense>} />
          <Route path="assets" element={<Suspense fallback={<TableSkeleton />}><Assets /></Suspense>} />
          <Route path="tax" element={<Suspense fallback={<TableSkeleton />}><Tax /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<TableSkeleton />}><FinanceReports /></Suspense>} />
        </Route>

        {/* Sales Sub-routes */}
        <Route path="/sales">
          <Route index element={<Navigate to="/sales/orders" replace />} />
          <Route path="quotations" element={<Suspense fallback={<TableSkeleton />}><Quotations /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<TableSkeleton />}><Orders /></Suspense>} />
          <Route path="pos" element={<Suspense fallback={<TableSkeleton />}><POS /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<TableSkeleton />}><Customers /></Suspense>} />
          <Route path="returns" element={<Suspense fallback={<TableSkeleton />}><Returns /></Suspense>} />
        </Route>

        {/* HRM Sub-routes */}
        <Route path="/hrm">
          <Route index element={<Navigate to="/hrm/employees" replace />} />
          <Route path="employees" element={<Suspense fallback={<TableSkeleton />}><Employees /></Suspense>} />
          <Route path="attendance" element={<Suspense fallback={<TableSkeleton />}><Attendance /></Suspense>} />
          <Route path="leave" element={<Suspense fallback={<TableSkeleton />}><Leave /></Suspense>} />
          <Route path="payroll" element={<Suspense fallback={<TableSkeleton />}><Payroll /></Suspense>} />
          <Route path="roles" element={<Suspense fallback={<TableSkeleton />}><Roles /></Suspense>} />
          <Route path="documents" element={<Suspense fallback={<TableSkeleton />}><Documents /></Suspense>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/tenants" element={<Suspense fallback={<TableSkeleton />}><Tenants /></Suspense>} />
        <Route path="/admin/industries" element={<Suspense fallback={<TableSkeleton />}><Industries /></Suspense>} />

        <Route 
          path="/settings" 
          element={
            <Suspense fallback={<TableSkeleton />}>
              <SettingsPage />
            </Suspense>
          } 
        />
      </Route>

      {/* Global Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/tenants" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
