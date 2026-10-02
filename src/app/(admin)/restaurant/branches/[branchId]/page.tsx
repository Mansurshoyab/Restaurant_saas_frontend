'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesApi } from '@/lib/api/branches.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { normalizeApiError } from '@/lib/api/client';

export default function BranchDetailPage({ params }: { params: { branchId: string } }) {
  const queryClient = useQueryClient();
  const { data: branch, isLoading } = useQuery({ queryKey: ['branches', params.branchId], queryFn: () => branchesApi.getById(params.branchId) });
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  useEffect(() => {
    if (branch) setForm({ name: branch.name, address: branch.address ?? '', phone: branch.phone ?? '' });
  }, [branch]);

  const updateMutation = useMutation({
    mutationFn: () => branchesApi.update(params.branchId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch updated');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  if (isLoading || !branch) return <LoadingSpinner />;

  return (
    <div className="max-w-md">
      <PageHeader title={branch.name} action={<Badge variant={branch.status === 'ACTIVE' ? 'success' : 'default'}>{branch.status}</Badge>} />
      <Card>
        <CardBody className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <Button isLoading={updateMutation.isPending} onClick={() => updateMutation.mutate()}>
            Save
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}


