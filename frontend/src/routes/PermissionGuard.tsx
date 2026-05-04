import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  moduleCode?: string;
}

/**
 * Guards routes based on permissions and active modules
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permissions = [], 
  moduleCode 
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const userPermissions = user.permissions || [];
  const activeModuleCodes = user.activeModules?.map((m: any) => m.code) || [];
  const isSuperAdmin = user.roles?.some((r: any) => r.role.name === 'SUPER_ADMIN');

  // 1. Module Check
  if (moduleCode && !isSuperAdmin) {
    if (!activeModuleCodes.includes(moduleCode)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 2. Permission Check
  if (permissions.length > 0 && !isSuperAdmin) {
    const hasPermission = permissions.some(p => userPermissions.includes(p));
    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default PermissionGuard;
