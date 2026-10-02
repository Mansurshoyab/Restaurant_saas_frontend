export interface Organization {
  _id: string;
  name: string;
  ownerId: string | { _id: string; name: string; email?: string };
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  logoUrl: string | null;
  logoKey: string | null;
  createdAt: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
}


