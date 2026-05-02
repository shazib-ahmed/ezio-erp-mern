import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Building2,
  Tag
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  subItems?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { 
    icon: Package, 
    label: 'Inventory', 
    path: '/inventory' 
  },
  { 
    icon: Wallet, 
    label: 'Finance', 
    path: '/finance',
    subItems: [
      { label: 'General Ledger', path: '/finance/ledger' },
      { label: 'Bank & Accounts', path: '/finance/accounts' },
      { label: 'Payable/Receivable', path: '/finance/payable-receivable' },
      { label: 'Asset Management', path: '/finance/assets' },
      { label: 'Tax & VAT', path: '/finance/tax' },
      { label: 'Financial Reports', path: '/finance/reports' },
    ]
  },
  { 
    icon: ShoppingCart, 
    label: 'Sales', 
    path: '/sales',
    subItems: [
      { label: 'Quotations', path: '/sales/quotations' },
      { label: 'Sales Orders', path: '/sales/orders' },
      { label: 'POS Terminal', path: '/sales/pos' },
      { label: 'Customer Credit', path: '/sales/customers' },
      { label: 'Returns & Refunds', path: '/sales/returns' },
    ]
  },
  { 
    icon: Users, 
    label: 'HRM', 
    path: '/hrm',
    subItems: [
      { label: 'Employees', path: '/hrm/employees' },
      { label: 'Attendance', path: '/hrm/attendance' },
      { label: 'Leave Management', path: '/hrm/leave' },
      { label: 'Payroll', path: '/hrm/payroll' },
      { label: 'Roles & Permissions', path: '/hrm/roles' },
      { label: 'Document Vault', path: '/hrm/documents' },
    ]
  },
  { 
    icon: Building2, 
    label: 'Tenants', 
    path: '/admin/tenants' 
  },
  { 
    icon: Tag, 
    label: 'Industries', 
    path: '/admin/industries' 
  },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  React.useEffect(() => {
    const currentParent = navItems.find(item => 
      item.subItems && location.pathname.startsWith(item.path)
    )?.label;
    
    if (currentParent) {
      setExpandedItem(currentParent);
    }
  }, [location.pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 h-screen bg-[#0f1113] text-gray-300 transition-transform duration-300 ease-in-out transform border-r border-white/5",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="font-black text-white text-xl italic">E</span>
              </div>
              <span className="text-lg font-bold text-white leading-none tracking-tight">Ezio-ERP</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden text-gray-400 hover:text-white hover:bg-white/5" onClick={onClose}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isParentActive = location.pathname.startsWith(item.path);
              const isExpanded = expandedItem === item.label;

              return (
                <div key={item.label} className="space-y-1">
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group",
                          isParentActive 
                            ? "bg-white/5 text-white" 
                            : "hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn(
                            "h-[18px] w-[18px] transition-colors", 
                            isParentActive ? "text-primary" : "text-gray-500 group-hover:text-white"
                          )} />
                          <span className={cn("text-sm font-medium", isParentActive ? "text-white" : "text-gray-400 group-hover:text-white")}>
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 text-gray-500",
                          isExpanded && "rotate-90"
                        )} />
                      </button>
                      
                      <div className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out pl-9 space-y-1",
                        isExpanded ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
                      )}>
                        {item.subItems.map((sub) => {
                          const isSubActive = location.pathname === sub.path;
                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => window.innerWidth < 1024 && onClose()}
                              className={cn(
                                "flex items-center h-9 px-4 rounded-lg text-[13px] font-medium transition-all relative",
                                isSubActive 
                                  ? "text-primary bg-primary/5" 
                                  : "text-gray-500 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {isSubActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                              )}
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                        location.pathname === item.path 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className={cn(
                        "h-[18px] w-[18px] transition-colors",
                        location.pathname === item.path ? "text-white" : "text-gray-500 group-hover:text-white"
                      )} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
