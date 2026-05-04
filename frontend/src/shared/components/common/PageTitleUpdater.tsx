import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pathTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/finance/ledger': 'General Ledger',
  '/finance/accounts': 'Chart of Accounts',
  '/finance/payable-receivable': 'Payable & Receivable',
  '/finance/assets': 'Assets',
  '/finance/tax': 'Tax',
  '/finance/reports': 'Finance Reports',
  '/sales/quotations': 'Quotations',
  '/sales/orders': 'Sales Orders',
  '/sales/pos': 'POS',
  '/sales/customers': 'Customers',
  '/sales/returns': 'Returns',
  '/hrm/employees': 'Employees',
  '/hrm/attendance': 'Attendance',
  '/hrm/leave': 'Leave',
  '/hrm/payroll': 'Payroll',
  '/hrm/roles': 'Roles',
  '/hrm/documents': 'Documents',
  '/settings': 'Settings',
  '/admin/tenants': 'All Tenants',
  '/admin/industries': 'Industries',
  '/login': 'Login',
  '/signup': 'Signup',
};

const PageTitleUpdater: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exact match or fallback for sub-routes
    const title = pathTitleMap[pathname] || 
                 (pathname.includes('/finance') ? 'Finance' : 
                  pathname.includes('/sales') ? 'Sales' : 
                  pathname.includes('/hrm') ? 'HRM' : 
                  pathname.includes('/admin') ? 'Admin' : 'ERP System');
    
    document.title = `${title} | Ezio-ERP`;
  }, [pathname]);

  return null;
};

export default PageTitleUpdater;
