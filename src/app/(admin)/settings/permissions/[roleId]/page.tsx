'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '@/lib/api/roles.api';
import { usePermissionCatalog, useUpdateRole } from '@/lib/hooks/useRoles';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PermissionMatrix } from '@/components/staff/PermissionMatrix';
import { normalizeApiError } from '@/lib/api/client';

export default function RoleDetailPage({ params }: { params: { roleId: string } }) {
  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: rolesApi.list });
  const { data: permissions } = usePermissionCatalog();
  const updateRole = useUpdateRole();

  const role = roles?.find((r) => r._id === params.roleId);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (role) setSelected(role.permissions);
  }, [role]);

  const toggle = (key: string) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  if (!role || !permissions) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="max-w-lg">
      <PageHeader title={role.name} />
      <Card>
        <CardBody className="space-y-5">
          <PermissionMatrix permissions={permissions} selected={selected} onToggle={toggle} />
          <Button
            isLoading={updateRole.isPending}
            onClick={async () => {
              try {
                await updateRole.mutateAsync({ id: role._id, payload: { permissions: selected } });
                toast.success('Permissions updated');
              } catch (err) {
                toast.error(normalizeApiError(err).message);
              }
            }}
          >
            Save permissions
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}



