'use client';

import { useRouter } from 'next/navigation';
import { useRoles } from '@/lib/hooks/useRoles';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsSubNav } from '@/components/settings/SettingsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';

export default function RolesListPage() {
  const router = useRouter();
  const { data: roles, isLoading } = useRoles();

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        description="System roles are fixed. Create custom roles for finer control."
      />

      <SettingsSubNav />

      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable
              data={roles}
              onRowClick={(r) =>
                !r.isSystem &&
                router.push(`/settings/permissions/${r._id}`)
              }
              columns={[
                { header: 'Name', accessor: (r) => r.name },
                {
                  header: 'Type',
                  accessor: (r) => (r.isSystem ? 'System' : 'Custom'),
                },
                {
                  header: 'Permissions',
                  accessor: (r) => r.permissions.length,
                },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


