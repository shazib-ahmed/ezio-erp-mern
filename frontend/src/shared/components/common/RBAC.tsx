import React from 'react';
import { useAppSelector } from '@/app/hooks';

interface RBACProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
}

/**
 * A component that conditionally renders its children based on user permissions or roles.
 */
export const Can: React.FC<RBACProps> = ({ 
  children, 
  permissions = [], 
  roles = [], 
  requireAll = false 
}) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const userPermissions = user.permissions || [];
  const userRoles = user.roles?.map((r: any) => r.role.name) || [];

  const hasPermission = permissions.length === 0 || (requireAll 
    ? permissions.every(p => userPermissions.includes(p))
    : permissions.some(p => userPermissions.includes(p)));

  const hasRole = roles.length === 0 || (requireAll
    ? roles.every(r => userRoles.includes(r))
    : roles.some(r => userRoles.includes(r)));

  if (hasPermission && hasRole) {
    return <>{children}</>;
  }

  return null;
};
