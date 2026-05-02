export interface Tenant {
  id: number;
  companyName: string;
  subdomain: string;
  industry: string;
  ownerName: string;
  email: string;
  status: 'Active' | 'Suspended' | 'Pending';
  createdAt: string;
}

export interface Industry {
  id: number;
  name: string;
  slug: string;
  tenantCount: number;
  status: 'Active' | 'Inactive';
}
