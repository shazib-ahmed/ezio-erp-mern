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

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/finance" element={<Navigate to="/finance/ledger" replace />} />
      <Route path="/hrm" element={<Navigate to="/hrm/employees" replace />} />
    </Routes>
  );
};

export default AppRoutes;
