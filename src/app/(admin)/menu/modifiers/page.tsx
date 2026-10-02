'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { modifiersApi } from '@/lib/api/modifiers.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { normalizeApiError } from '@/lib/api/client';
import { MenuSubNav } from '@/components/menu/MenuSubNav';


export default function ModifierGroupsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: groups, isLoading } = useQuery({ queryKey: ['modifiers', 'groups'], queryFn: modifiersApi.listGroups });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', selectionType: 'MULTIPLE', required: false });

  const createMutation = useMutation({
    mutationFn: () => modifiersApi.createGroup(form as any),
    onSuccess: (group) => {
      queryClient.invalidateQueries({ queryKey: ['modifiers', 'groups'] });
      toast.success('Modifier group created');
      router.push(`/menu/modifiers/${group._id}`);
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div>
      <PageHeader
        title="Modifiers"
        description="Add-ons and choices for menu items — Cheese, Sauce, Pizza Size."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add group
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate();
              }}
              className="grid grid-cols-3 gap-3"
            >
              <Input label="Group name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Add-ons" required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-ink">Selection type</label>
                <select
                  value={form.selectionType}
                  onChange={(e) => setForm((f) => ({ ...f, selectionType: e.target.value }))}
                  className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="MULTIPLE">Multiple (add-ons)</option>
                  <option value="SINGLE">Single (size, etc.)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.required}
                  onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                Required
              </label>
              <div className="col-span-3 flex gap-2">
                <Button type="submit" isLoading={createMutation.isPending}>
                  Create
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
              data={groups}
              onRowClick={(g) => router.push(`/menu/modifiers/${g._id}`)}
              emptyMessage="No modifier groups yet."
              columns={[
                { header: 'Name', accessor: (g) => g.name },
                { header: 'Type', accessor: (g) => g.selectionType },
                { header: 'Required', accessor: (g) => (g.required ? 'Yes' : 'No') },
                { header: 'Options', accessor: (g) => g.modifiers?.length ?? 0 },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


