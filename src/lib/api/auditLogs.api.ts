import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface AuditLog {
  _id: string;
  userId: { _id: string; name: string } | string;
  branchId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: unknown;
  newValue: unknown;
  reason: string | null;
  createdAt: string;
}

export interface ListAuditLogsParams {
  entityType?: string;
  entityId?: string;
  userId?: string;
  from?: string;
  to?: string;
}

export const auditLogsApi = {
  list: (params?: ListAuditLogsParams) =>
    apiClient.get<ApiResponse<AuditLog[]>>('/audit-logs', { params }).then((r) => r.data.data),
};


