'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { RestaurantSubNav } from '@/components/restaurant/RestaurantSubNav';
import { tablesApi } from '@/lib/api/tables.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { cn } from '@/lib/utils/cn';
import { normalizeApiError } from '@/lib/api/client';

export default function TablesAdminPage() {
  const queryClient = useQueryClient();
  const { data: tables, isLoading } = useQuery({ queryKey: ['tables'], queryFn: () => tablesApi.list() });
  const { data: areas } = useQuery({ queryKey: ['dining-areas'], queryFn: tablesApi.listDiningAreas });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', seats: '4', diningAreaId: '' });

  const createMutation = useMutation({
    mutationFn: () => tablesApi.create({ label: form.label, seats: Number(form.seats), diningAreaId: form.diningAreaId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      setShowForm(false);
      setForm({ label: '', seats: '4', diningAreaId: '' });
      toast.success('Table created');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div>
      <PageHeader
        title="Restaurant Management"
        description="Manage your staff, branches, and tables."
        action={
          <div className="flex gap-2">
            <Link href="/restaurant/tables/dining-areas">
              <Button variant="secondary">Manage dining areas</Button>
            </Link>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Add table
            </Button>
          </div>
        }
      />
      
      <RestaurantSubNav />

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate();
              }}
              className="grid grid-cols-4 gap-3"
            >
              <Input label="Label" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="A1" required />
              <Input label="Seats" type="number" min={1} value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-ink">Dining area</label>
                <select
                  value={form.diningAreaId}
                  onChange={(e) => setForm((f) => ({ ...f, diningAreaId: e.target.value }))}
                  className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">None</option>
                  {areas?.map((a: any) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
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
              data={tables}
              emptyMessage="No tables yet."
              columns={[
                { header: 'Label', accessor: (t) => t.label },
                { header: 'Seats', accessor: (t) => t.seats },
                {
                  header: 'Status',
                  accessor: (t) => (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        t.status === 'AVAILABLE' && 'bg-success-light text-success',
                        t.status === 'OCCUPIED' && 'bg-warning-light text-warning',
                        t.status === 'RESERVED' && 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {t.status}
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


