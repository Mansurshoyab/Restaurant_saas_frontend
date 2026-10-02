'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { suppliersApi } from '@/lib/api/purchases.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { normalizeApiError } from '@/lib/api/client';

export default function SuppliersPage() {
  const queryClient = useQueryClient();
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: () => suppliersApi.list() });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', paymentTerms: '' });

  const createMutation = useMutation({
    mutationFn: suppliersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setShowForm(false);
      setForm({ name: '', phone: '', paymentTerms: '' });
      toast.success('Supplier added');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div>
      <PageHeader
        title="Suppliers"
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add supplier
          </Button>
        }
      />

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
              <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <Input
                label="Payment terms"
                value={form.paymentTerms}
                onChange={(e) => setForm((f) => ({ ...f, paymentTerms: e.target.value }))}
                placeholder="Net 15"
              />
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
          <DataTable
            data={suppliers}
            emptyMessage="No suppliers yet."
            columns={[
              { header: 'Name', accessor: (s) => s.name },
              { header: 'Phone', accessor: (s) => s.phone ?? '—' },
              { header: 'Terms', accessor: (s) => s.paymentTerms ?? '—' },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}


