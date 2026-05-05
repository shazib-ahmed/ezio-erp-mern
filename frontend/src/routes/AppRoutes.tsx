import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Skeleton } from '@/shared/ui/skeleton';
import { DashboardSkeleton } from '@/shared/components/skeletons/DashboardSkeleton';
import { TableSkeleton } from '@/shared/components/skeletons/TableSkeleton';
import { CardSkeleton } from '@/shared/components/skeletons/CardSkeleton';
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
const Transactions = lazy(() => import('@/pages/finance/Transactions'));
const Expenses = lazy(() => import('@/pages/finance/Expenses'));

const StockManagement = lazy(() => import('@/pages/inventory/StockManagement'));
const Categories = lazy(() => import('@/pages/inventory/Categories'));
const Brands = lazy(() => import('@/pages/inventory/Brands'));

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

        {/* Inventory Sub-routes */}
        <Route path="/inventory">
          <Route index element={<Navigate to="/inventory/products" replace />} />
          <Route 
            path="products" 
            element={
              <PermissionGuard moduleCode="MOD_INVENTORY" permissions={['PRODUCT_VIEW']}>
                <Suspense fallback={<TableSkeleton />}>
                  <Inventory />
                </Suspense>
              </PermissionGuard>
            } 
          />
          <Route 
            path="stock" 
            element={
              <PermissionGuard moduleCode="MOD_INVENTORY" permissions={['STOCK_ADJUST']}>
                <Suspense fallback={<TableSkeleton />}>
                  <StockManagement />
                </Suspense>
              </PermissionGuard>
            } 
          />
          <Route 
            path="categories" 
            element={
              <PermissionGuard moduleCode="MOD_INVENTORY" permissions={['PRODUCT_VIEW']}>
                <Suspense fallback={<TableSkeleton />}>
                  <Categories />
                </Suspense>
              </PermissionGuard>
            } 
          />
          <Route 
            path="brands" 
            element={
              <PermissionGuard moduleCode="MOD_INVENTORY" permissions={['PRODUCT_VIEW']}>
                <Suspense fallback={<TableSkeleton />}>
                  <Brands />
                </Suspense>
              </PermissionGuard>
            } 
          />
        </Route>

        {/* Finance Sub-routes */}
        <Route path="/finance">
          <Route index element={<Navigate to="/finance/transactions" replace />} />
          <Route path="transactions" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Transactions /></Suspense></PermissionGuard>} />
          <Route path="expenses" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['EXPENSE_VIEW']}><Suspense fallback={<TableSkeleton />}><Expenses /></Suspense></PermissionGuard>} />
          <Route path="ledger" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Ledger /></Suspense></PermissionGuard>} />
          <Route path="accounts" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['ACCOUNT_VIEW']}><Suspense fallback={<TableSkeleton />}><Accounts /></Suspense></PermissionGuard>} />
          <Route path="payable-receivable" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><PayableReceivable /></Suspense></PermissionGuard>} />
          <Route path="assets" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Assets /></Suspense></PermissionGuard>} />
          <Route path="tax" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><Tax /></Suspense></PermissionGuard>} />
          <Route path="reports" element={<PermissionGuard moduleCode="MOD_FINANCE" permissions={['TRX_VIEW']}><Suspense fallback={<TableSkeleton />}><FinanceReports /></Suspense></PermissionGuard>} />
        </Route>

        {/* Sales Sub-routes */}
        <Route path="/sales">
          <Route index element={<Navigate to="/sales/history" replace />} />
          <Route path="history" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Orders /></Suspense></PermissionGuard>} />
          <Route path="customers" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['CUSTOMER_VIEW']}><Suspense fallback={<TableSkeleton />}><Customers /></Suspense></PermissionGuard>} />
          <Route path="quotations" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Quotations /></Suspense></PermissionGuard>} />
          <Route path="orders" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Orders /></Suspense></PermissionGuard>} />
          <Route path="returns" element={<PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_VIEW']}><Suspense fallback={<TableSkeleton />}><Returns /></Suspense></PermissionGuard>} />
        </Route>

        {/* POS Terminal */}
        <Route path="/pos" element={
          <PermissionGuard moduleCode="MOD_SALES" permissions={['SALE_CREATE']}>
            <Suspense fallback={
              <div className="animate-in fade-in duration-500 h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1 bg-muted/50 rounded-lg" />
                    <Skeleton className="h-10 w-40 bg-muted/50 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="h-48 rounded-xl border border-border/50 bg-card/50 p-6 flex flex-col items-center justify-between">
                        <Skeleton className="h-12 w-12 rounded-xl bg-muted/50" />
                        <div className="space-y-2 w-full flex flex-col items-center">
                          <Skeleton className="h-4 w-3/4 bg-muted/50" />
                          <Skeleton className="h-4 w-1/2 bg-muted/50" />
                        </div>
                        <Skeleton className="h-5 w-20 bg-muted/50" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full lg:w-96 flex flex-col gap-6 bg-card border border-border rounded-xl p-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <Skeleton className="h-6 w-32 bg-muted/50" />
                    <Skeleton className="h-6 w-12 bg-muted/50" />
                  </div>
                  <div className="flex-1 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3 bg-muted/20 p-2 rounded-lg border border-border/50">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24 bg-muted/50" />
                          <Skeleton className="h-3 w-16 bg-muted/50" />
                        </div>
                        <Skeleton className="h-8 w-16 bg-muted/50" />
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between"><Skeleton className="h-4 w-20 bg-muted/50" /><Skeleton className="h-4 w-12 bg-muted/50" /></div>
                    <div className="flex justify-between"><Skeleton className="h-6 w-24 bg-muted/50" /><Skeleton className="h-6 w-16 bg-muted/50" /></div>
                    <Skeleton className="h-14 w-full bg-primary/20 rounded-lg" />
                  </div>
                </div>
              </div>
            }>
              <POS />
            </Suspense>
          </PermissionGuard>
        } />

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
        <Route 
          path="/admin/tenants" 
          element={
            <PermissionGuard permissions={['TENANT_MANAGE']}>
              <Suspense fallback={
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-64 bg-muted/50" />
                      <Skeleton className="h-4 w-96 bg-muted/50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    <CardSkeleton count={6} />
                  </div>
                </div>
              }>
                <Tenants />
              </Suspense>
            </PermissionGuard>
          } 
        />
        <Route 
          path="/admin/industries" 
          element={
            <PermissionGuard permissions={['INDUSTRY_MANAGE']}>
              <Suspense fallback={
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-64 bg-muted/50" />
                      <Skeleton className="h-4 w-96 bg-muted/50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <CardSkeleton count={8} />
                  </div>
                </div>
              }>
                <Industries />
              </Suspense>
            </PermissionGuard>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <Suspense fallback={
              <div className="animate-in fade-in duration-500">
                <div className="mb-8 space-y-2">
                  <Skeleton className="h-10 w-64 bg-muted/50" />
                  <Skeleton className="h-4 w-96 bg-muted/50" />
                </div>
                
                <div className="flex gap-2 mb-6">
                  <Skeleton className="h-10 w-24 rounded-lg bg-muted/50" />
                  <Skeleton className="h-10 w-28 rounded-lg bg-muted/50" />
                </div>

                <div className="max-w-4xl border border-border rounded-xl bg-card overflow-hidden">
                  <div className="p-6 border-b border-border bg-muted/10 space-y-2">
                    <Skeleton className="h-6 w-48 bg-muted/50" />
                    <Skeleton className="h-4 w-80 bg-muted/50" />
                  </div>
                  <div className="p-6 space-y-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                      <Skeleton className="w-32 h-32 rounded-2xl bg-muted/50" />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-muted/50" />
                            <Skeleton className="h-10 w-full bg-muted/50" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }>
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
