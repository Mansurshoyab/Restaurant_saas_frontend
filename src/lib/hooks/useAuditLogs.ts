'use client';

import { useQuery } from '@tanstack/react-query';
import { auditLogsApi, type ListAuditLogsParams } from '@/lib/api/auditLogs.api';

export function useAuditLogs(params?: ListAuditLogsParams) {
  return useQuery({ queryKey: ['audit-logs', params], queryFn: () => auditLogsApi.list(params) });
}


