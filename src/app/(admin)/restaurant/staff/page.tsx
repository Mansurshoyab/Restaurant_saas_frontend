'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useStaffList, useCreateStaff } from '@/lib/hooks/useStaff';
import { RestaurantSubNav } from '@/components/restaurant/RestaurantSubNav';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { RoleBadge } from '@/components/staff/RoleBadge';
import { StaffForm } from '@/components/staff/StaffForm';
import { formatRelative } from '@/lib/utils/date';
import { normalizeApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils/cn';

export default function StaffPage() {
  const router = useRouter();
  const { data: staff, isLoading } = useStaffList();
  const createStaff = useCreateStaff();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader
        title="Restaurant Management"
        description="Manage your staff, branches, and tables."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add staff
          </Button>
        }
      />
      
      <RestaurantSubNav />

      {showForm && (
        <Card className="mb-4 max-w-lg">
          <CardBody>
            <StaffForm
              isSubmitting={createStaff.isPending}
              onSubmit={async (payload) => {
                try {
                  await createStaff.mutateAsync(payload);
                  toast.success('Staff account created');
                  setShowForm(false);
                } catch (err) {
                  toast.error(normalizeApiError(err).message);
                }
              }}
            />
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable
              data={staff}
              onRowClick={(s) => router.push(`/restaurant/staff/${s._id}`)}
              emptyMessage="No staff added yet."
              columns={[
                { header: 'Name', accessor: (s) => s.name },
                { header: 'Contact', accessor: (s) => s.phone ?? s.email ?? '—' },
                {
                  header: 'Role',
                  accessor: (s) => <RoleBadge name={typeof s.roleId === 'string' ? s.roleId : s.roleId?.name ?? '—'} />,
                },
                { header: 'Last login', accessor: (s) => (s.lastLoginAt ? formatRelative(s.lastLoginAt) : 'Never') },
                {
                  header: 'Status',
                  accessor: (s) => (
                    <span className={cn('text-xs font-medium', s.isActive ? 'text-success' : 'text-danger')}>
                      {s.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  ),
                },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


