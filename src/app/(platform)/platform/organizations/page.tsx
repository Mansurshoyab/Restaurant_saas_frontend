'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePlatformOrganizations } from '@/lib/hooks/usePlatform';
import type { PlatformOrganizationRow } from '@/types/platform.types';

export default function OrganizationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [subStatus, setSubStatus] = useState('ALL');

  const { data: orgsResponse, isLoading } = usePlatformOrganizations({
    search: search || undefined,
    status: status !== 'ALL' ? status : undefined,
    subscriptionStatus: subStatus !== 'ALL' ? subStatus : undefined,
  });

  const orgs = orgsResponse?.data;

  const columns = [
    {
      header: 'Name',
      accessor: (row: PlatformOrganizationRow) => <span className="font-medium text-ink">{row.name}</span>,
    },
    {
      header: 'Status',
      accessor: (row: PlatformOrganizationRow) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'SUSPENDED' ? 'danger' : 'default'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Subscription',
      accessor: (row: PlatformOrganizationRow) => (
        <Badge
          variant={
            row.subscriptionStatus === 'ACTIVE'
              ? 'success'
              : row.subscriptionStatus === 'TRIAL'
              ? 'brand'
              : row.subscriptionStatus === 'EXPIRED'
              ? 'danger'
              : 'default'
          }
        >
          {row.subscriptionStatus}
        </Badge>
      ),
    },
    {
      header: 'Branches',
      accessor: (row: PlatformOrganizationRow) => <span className="tabular-nums">{row.branchCount}</span>,
    },
    {
      header: 'Users',
      accessor: (row: PlatformOrganizationRow) => <span className="tabular-nums">{row.userCount}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Organizations" />

      <div className="flex gap-4">
        <div className="w-64">
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
        </div>
        <div className="w-48">
          <Select value={subStatus} onChange={(e) => setSubStatus(e.target.value)}>
            <option value="ALL">All Subscriptions</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="EXPIRED">Expired</option>
            <option value="NONE">None</option>
          </Select>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <DataTable
            columns={columns}
            data={orgs}
            onRowClick={(row) => router.push(`/platform/organizations/${row._id}`)}
          />
        )}
      </Card>
    </div>
  );
}
