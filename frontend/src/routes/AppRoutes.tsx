import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardSkeleton } from '@/shared/components/skeletons/DashboardSkeleton';
import { TableSkeleton } from '@/shared/components/skeletons/TableSkeleton';
import ProtectedRoute from './ProtectedRoute';
import PermissionGuard from './PermissionGuard';
import { Loader2 } from 'lucide-react';

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
          <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <LoginPage />
          </Suspense>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
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
            <PermissionGuard moduleCode="MOD_INVENTORY" permissions={['PRODUCT_VIEW']}>
              <Suspense fallback={<TableSkeleton />}>
                <Inventory />
              </Suspense>
            </PermissionGuard>
          } 
        />

        {/* Finance Sub-routes */}
        <Route path="/finance">
          <Route index element={<Navigate to="/finance/ledger" replace />} />
          <Route path="ledger" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Ledger /></Suspense></PermissionGuard>} />
          <Route path="accounts" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['ACCOUNT_VIEW']}><Suspense fallback={<TableSkeleton />}><Accounts /></Suspense></PermissionGuard>} />
          <Route path="payable-receivable" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><PayableReceivable /></Suspense></PermissionGuard>} />
          <Route path="assets" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Assets /></Suspense></PermissionGuard>} />
          <Route path="tax" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Tax /></Suspense></PermissionGuard>} />
          <Route path="reports" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><FinanceReports /></Suspense></PermissionGuard>} />
        </Route>

        {/* Sales Sub-routes */}
        <Route path="/sales">
          <Route index element={<Navigate to="/sales/orders" replace />} />
          <Route path="quotations" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Quotations /></Suspense></PermissionGuard>} />
          <Route path="orders" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Orders /></Suspense></PermissionGuard>} />
          <Route path="pos" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_CREATE']}><Suspense fallback={<TableSkeleton />}><POS /></Suspense></PermissionGuard>} />
          <Route path="customers" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['CUSTOMER_VIEW']}><Suspense fallback={<TableSkeleton />}><Customers /></Suspense></PermissionGuard>} />
          <Route path="returns" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Returns /></Suspense></PermissionGuard>} />
        </Route>

        {/* HRM Sub-routes */}
        <Route path="/hrm">
          <Route index element={<Navigate to="/hrm/employees" replace />} />
          <Route path="employees" element={<PermissionGuard moduleCode="MOD_AUTH" permissions={['USER_VIEW']}><Suspense fallback={<TableSkeleton />}><Employees /></Suspense></PermissionGuard>} />
          <Route path="attendance" element={<PermissionGuard moduleCode="MOD_AUTH" permissions={['USER_VIEW']}><Suspense fallback={<TableSkeleton />}><Attendance /></Suspense></PermissionGuard>} />
          <Route path="leave" element={<PermissionGuard moduleCode="MOD_AUTH" permissions={['USER_VIEW']}><Suspense fallback={<TableSkeleton />}><Leave /></Suspense></PermissionGuard>} />
          <Route path="payroll" element={<PermissionGuard moduleCode="MOD_AUTH" permissions={['USER_VIEW']}><Suspense fallback={<TableSkeleton />}><Payroll /></Suspense></PermissionGuard>} />
          <Route path="roles" element={<PermissionGuard moduleCode="MOD_AUTH" permissions={['ROLE_MANAGE']}><Suspense fallback={<TableSkeleton />}><Roles /></Suspense></PermissionGuard>} />
          <Route path="documents" element={<PermissionGuard moduleCode="MOD_AUTH" permissions={['USER_VIEW']}><Suspense fallback={<TableSkeleton />}><Documents /></Suspense></PermissionGuard>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/tenants" element={<PermissionGuard permissions={['TENANT_MANAGE']}><Suspense fallback={<TableSkeleton />}><Tenants /></Suspense></PermissionGuard>} />
        <Route path="/admin/industries" element={<PermissionGuard permissions={['INDUSTRY_MANAGE']}><Suspense fallback={<TableSkeleton />}><Industries /></Suspense></PermissionGuard>} />

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
