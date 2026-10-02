'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesApi } from '@/lib/api/branches.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export default function NewBranchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  const createMutation = useMutation({
    mutationFn: () => branchesApi.create(form),
    onSuccess: (branch) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created');
      router.push(`/restaurant/branches/${branch._id}`);
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div className="max-w-md">
      <PageHeader title="Add branch" />
      <Card>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="space-y-4"
          >
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Button type="submit" isLoading={createMutation.isPending}>
              Create branch
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


