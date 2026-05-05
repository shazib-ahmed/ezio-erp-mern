export interface Module {
  id: number;
  name: string;
  code: string;
  icon: string | null;
  features?: Feature[];
}

export interface Feature {
  id: number;
  name: string;
  code: string;
  moduleId: number;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  moduleId: number;
  featureId: number;
  module?: Module;
  feature?: Feature;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
}

export interface Role {
  id: number;
  name: string;
  permissions: RolePermission[];
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  role: Role;
}

export interface Tenant {
  id: number;
  name: string;
  phone: string;
  logo?: string;
  tenantId: number; // The Owner User ID
  industryId: number;
  activeModules?: Module[];
}



export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  roles: UserRole[];
  tenantId?: number;
  tenant?: Tenant;
  permissions?: string[]; // Flat permissions array from backend
  activeModules?: Module[]; // Active modules for the current tenant
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  error: string | null;
}
