export interface Module {
  id: string;
  name: string;
  code: string;
}

export interface Industry {
  id: string;
  name: string;
  description?: string;
  modules: Module[];
  _count?: {
    tenants: number;
  };
  createdAt: string;
}

export interface IndustryState {
  industries: Industry[];
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  nextCursor: number | null;
  hasMore: boolean;
  searchQuery: string;
}
