'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { RestaurantSubNav } from '@/components/restaurant/RestaurantSubNav';
import { branchesApi } from '@/lib/api/branches.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { normalizeApiError } from '@/lib/api/client';

export default function BranchesPage() {
  const queryClient = useQueryClient();
  const { data: branches, isLoading } = useQuery({ queryKey: ['branches'], queryFn: branchesApi.list });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  const createMutation = useMutation({
    mutationFn: branchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setShowForm(false);
      toast.success('Branch created');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div>
      <PageHeader
        title="Restaurant Management"
        description="Manage your staff, branches, and tables."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add branch
          </Button>
        }
      />
      
      <RestaurantSubNav />

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(form);
              }}
              className="grid grid-cols-3 gap-3"
            >
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <div className="col-span-3 flex gap-2">
                <Button type="submit" isLoading={createMutation.isPending}>
                  Save
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable
              data={branches}
              columns={[
                { header: 'Name', accessor: (b) => b.name },
                { header: 'Address', accessor: (b) => b.address ?? '—' },
                { header: 'Status', accessor: (b) => b.status },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}



