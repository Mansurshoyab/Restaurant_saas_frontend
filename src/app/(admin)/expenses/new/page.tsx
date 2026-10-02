'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { expensesApi } from '@/lib/api/expenses.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';


export default function NewExpensePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ['expense-categories'], queryFn: () => expensesApi.listCategories() });
  const [form, setForm] = useState({ category: '', description: '', amount: '', method: 'CASH' });

  const createMutation = useMutation({
    mutationFn: () => expensesApi.create({ ...form, amount: Number(form.amount) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense recorded');
      router.push('/expenses');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div className="max-w-md">
      <PageHeader title="Add expense" />
      <Card>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="space-y-4"
          >
            <Select label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required>
              <option value="" disabled>Select category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </Select>
            <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <Input label="Amount" type="number" min={0} step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} required />
            <Button type="submit" isLoading={createMutation.isPending}>
              Record expense
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


