import { User } from '@/core/auth/types/auth.types';

export interface Industry {
  id: number;
  name: string;
  description: string;
}

export interface Module {
  id: number;
  name: string;
  code: string;
  icon: string | null;
}

export interface Tenant {
  id: number;
  name: string;
  phone: string;
  tenantId: number;
  industryId: number;
  industry: Industry;
  users: { user: User }[];
  activeModules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantsState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  loading: boolean;
  error: string | null;
  stats: {
    totalTenants: number;
    totalIndustries: number;
  } | null;
  nextCursor: number | null;
  hasMore: boolean;
  searchQuery: string;
}
