'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { usePlatformOrganizationDetail, useUpdateOrganizationStatus } from '@/lib/hooks/usePlatform';
import { toast } from 'sonner';
import { normalizeApiError } from '@/lib/api/client';

export default function OrganizationDetailPage({ params }: { params: { organizationId: string } }) {
  const router = useRouter();
  const orgId = params.organizationId;
  const { data: detail, isLoading } = usePlatformOrganizationDetail(orgId);
  const updateStatus = useUpdateOrganizationStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const actionType = detail?.organization.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

  const handleUpdateStatus = async () => {
    if (!reason.trim()) {
      toast.error('Reason is required');
      return;
    }
    try {
      await updateStatus.mutateAsync({ id: orgId, payload: { status: actionType, reason } });
      toast.success(`Organization ${actionType === 'ACTIVE' ? 'reactivated' : 'suspended'}`);
      setDialogOpen(false);
      setReason('');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;
  if (!detail) return <div className="text-danger">Failed to load organization details.</div>;

  const { organization: org, branches, users, subscriptions, usage } = detail;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={org.name} />
        <Button
          variant={org.status === 'ACTIVE' ? 'danger' : 'primary'}
          onClick={() => {
            setReason('');
            setDialogOpen(true);
          }}
        >
          {org.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardBody className="py-5">
            <h3 className="mb-4 text-sm font-medium text-ink-muted">Organization Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Status</span>
                <Badge variant={org.status === 'ACTIVE' ? 'success' : org.status === 'SUSPENDED' ? 'danger' : 'default'}>
                  {org.status}
                </Badge>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Subscription</span>
                <Badge variant={org.subscriptionStatus === 'ACTIVE' ? 'success' : org.subscriptionStatus === 'TRIAL' ? 'brand' : 'default'}>
                  {org.subscriptionStatus}
                </Badge>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Owner</span>
                <span className="font-medium text-ink">{org.ownerName || (org as any).ownerId?.name || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Email</span>
                <span className="text-ink">{org.email || (org as any).ownerId?.email || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Phone</span>
                <span className="text-ink">{org.phone || (org as any).ownerId?.phone || '-'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-muted">Joined</span>
                <span className="text-ink">{new Date(org.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="py-5">
            <h3 className="mb-4 text-sm font-medium text-ink-muted">Usage Stats</h3>
            <div className="flex items-baseline gap-4 border-b border-slate-50 pb-4">
              <span className="text-3xl font-bold tabular-nums text-ink">{usage.totalOrders}</span>
              <span className="text-sm text-ink-muted">Total Orders</span>
            </div>
            <div className="pt-4">
              <span className="block text-sm text-ink-muted">Total Revenue</span>
              <div className="mt-1 text-2xl font-bold">
                <CurrencyDisplay amount={usage.totalRevenue} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-medium text-ink">Branches ({branches.length})</h3>
        </div>
        <DataTable
          columns={[
            { header: 'Name', accessor: (row) => <span className="font-medium text-ink">{row.name}</span> },
            { header: 'Address', accessor: (row) => row.address || '-' },
          ]}
          data={branches}
          emptyMessage="No branches found."
        />
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-medium text-ink">Staff ({users.length})</h3>
        </div>
        <DataTable
          columns={[
            { header: 'Name', accessor: (row) => <span className="font-medium text-ink">{row.name}</span> },
            { 
              header: 'Role', 
              accessor: (row) => {
                const role = row.roleId as any;
                const roleName = typeof role === 'object' && role !== null ? role.name : role;
                return <span className="text-ink-muted">{roleName || 'N/A'}</span>;
              }
            },
          ]}
          data={users}
          emptyMessage="No staff members found."
        />
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-medium text-ink">Subscription History</h3>
        </div>
        <DataTable
          columns={[
            { 
              header: 'Plan', 
              accessor: (row) => {
                const planName = (row as any).plan?.name || (row as any).planId?.name || (row as any).plan || 'Unknown';
                return <span className="font-medium text-ink">{planName}</span>;
              }
            },
            {
              header: 'Status',
              accessor: (row) => (
                <Badge variant={row.status === 'ACTIVE' ? 'success' : 'default'}>{row.status}</Badge>
              ),
            },
            { header: 'Start Date', accessor: (row) => new Date(row.startDate).toLocaleDateString() },
            { header: 'End Date', accessor: (row) => new Date(row.endDate).toLocaleDateString() },
          ]}
          data={subscriptions}
          emptyMessage="No subscriptions found."
        />
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={actionType === 'ACTIVE' ? 'Reactivate Organization' : 'Suspend Organization'}
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Are you sure you want to {actionType === 'ACTIVE' ? 'reactivate' : 'suspend'} this organization?
            A reason is required.
          </p>
          <Input
            placeholder="Reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'ACTIVE' ? 'primary' : 'danger'}
              className="flex-1"
              isLoading={updateStatus.isPending}
              onClick={handleUpdateStatus}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
