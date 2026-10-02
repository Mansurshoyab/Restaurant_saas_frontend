'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useStaffMember, useUpdateStaff, useDeactivateStaff } from '@/lib/hooks/useStaff';
import { rolesApi } from '@/lib/api/roles.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ResetPasswordDialog } from '@/components/staff/ResetPasswordDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { normalizeApiError } from '@/lib/api/client';

export default function StaffDetailPage({ params }: { params: { userId: string } }) {
  const { data: staff, isLoading } = useStaffMember(params.userId);
  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: rolesApi.list });
  const updateStaff = useUpdateStaff();
  const deactivateStaff = useDeactivateStaff();

  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);

  if (isLoading || !staff) return <p className="text-sm text-ink-muted">Loading…</p>;

  const currentName = name || staff.name;
  const currentRoleId = roleId || (typeof staff.roleId === 'string' ? staff.roleId : staff.roleId?._id) || '';

  return (
    <div className="max-w-md">
      <PageHeader title={staff.name} />

      <Card>
        <CardBody className="space-y-4">
          <Input label="Name" value={currentName} onChange={(e) => setName(e.target.value)} />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Role</label>
            <select
              value={currentRoleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {roles?.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            isLoading={updateStaff.isPending}
            onClick={async () => {
              try {
                await updateStaff.mutateAsync({ id: staff._id, payload: { name: currentName, roleId: currentRoleId } });
                toast.success('Staff updated');
              } catch (err) {
                toast.error(normalizeApiError(err).message);
              }
            }}
          >
            Save changes
          </Button>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowResetPassword(true)}>
              Reset password
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => setShowDeactivate(true)}>
              Deactivate
            </Button>
          </div>
        </CardBody>
      </Card>

      {showResetPassword && <ResetPasswordDialog userId={staff._id} onClose={() => setShowResetPassword(false)} />}

      <ConfirmDialog
        open={showDeactivate}
        title="Deactivate staff account"
        message={`${staff.name} will no longer be able to log in. This can be reversed later.`}
        confirmLabel="Deactivate"
        danger
        isLoading={deactivateStaff.isPending}
        onCancel={() => setShowDeactivate(false)}
        onConfirm={async () => {
          try {
            await deactivateStaff.mutateAsync(staff._id);
            toast.success('Staff deactivated');
            setShowDeactivate(false);
          } catch (err) {
            toast.error(normalizeApiError(err).message);
          }
        }}
      />
    </div>
  );
}


