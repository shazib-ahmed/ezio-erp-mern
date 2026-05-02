import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Wallet
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
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { 
    icon: Wallet, 
    label: 'Finance', 
    path: '/finance',
    subItems: [
      { label: 'General Ledger', path: '/finance/ledger' },
      { label: 'Accounts', path: '/finance/accounts' },
      { label: 'Payable & Receivable', path: '/finance/payable-receivable' },
      { label: 'Asset Management', path: '/finance/assets' },
      { label: 'Tax Management', path: '/finance/tax' },
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
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  // Find which item should be expanded by default based on current path
  const initialExpanded = navItems.find(item => 
    item.subItems && location.pathname.startsWith(item.path)
  )?.label || null;

  const [expandedItem, setExpandedItem] = useState<string | null>(initialExpanded);

  // Auto-expand when path changes (e.g. from dashboard to finance)
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 h-screen bg-[#1a1c1e] text-white transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between h-16 px-6 bg-[#141517]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Ezio-ERP</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={onClose}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const isExpanded = expandedItem === item.label;

              return (
                <div key={item.label}>
                  {item.subItems ? (
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                        isActive ? "bg-primary text-white font-semibold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        location.pathname === item.path ? "bg-primary text-white font-semibold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-white")} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.subItems && isExpanded && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all duration-200",
                              isSubActive ? "bg-white/10 text-white font-medium" : "text-gray-500 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                <span className="text-primary font-bold">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">Shazib Ahmed</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
