export interface Module {
  id: number;
  name: string;
  code: string;
  icon: string | null;
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
  tenantId: number; // The Owner User ID
  industryId: number;
}

export interface UserTenant {
  id: number;
  userId: number;
  tenantId: number;
  tenant: Tenant;
}

export interface User {
  id: number;
  email: string;
  roles: UserRole[];
  tenants: UserTenant[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
