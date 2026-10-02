'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsSubNav } from '@/components/settings/SettingsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDateTime } from '@/lib/utils/date';

export default function AuditLogPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data: logs, isLoading } = useAuditLogs(range);

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Every price change, cancellation, and permission edit."
        action={<DateRangePicker onChange={setRange} />}
      />

      <SettingsSubNav />

      <Card>
        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              data={logs}
              emptyMessage="No activity recorded in this period."
              columns={[
                {
                  header: 'Date',
                  accessor: (l) => formatDateTime(l.createdAt),
                },
                {
                  header: 'User',
                  accessor: (l) =>
                    typeof l.userId === 'string'
                      ? l.userId
                      : l.userId.name,
                },
                {
                  header: 'Action',
                  accessor: (l) => l.action.replace(/_/g, ' '),
                },
                {
                  header: 'Entity',
                  accessor: (l) => l.entityType,
                },
                {
                  header: 'Reason',
                  accessor: (l) => l.reason ?? '—',
                },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


