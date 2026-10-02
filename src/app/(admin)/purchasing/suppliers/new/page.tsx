'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateSupplier } from '@/lib/hooks/useSuppliers';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { normalizeApiError } from '@/lib/api/client';

export default function NewSupplierPage() {
  const router = useRouter();
  const createSupplier = useCreateSupplier();
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '', paymentTerms: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supplier = await createSupplier.mutateAsync(form);
      toast.success('Supplier created');
      router.push(`/purchasing/suppliers/${supplier._id}`);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="max-w-md">
      <PageHeader title="Add supplier" />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Contact person" value={form.contactPerson} onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            <Input label="Payment terms" value={form.paymentTerms} onChange={(e) => setForm((f) => ({ ...f, paymentTerms: e.target.value }))} placeholder="Net 15" />
            <Button type="submit" isLoading={createSupplier.isPending}>
              Create supplier
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

