'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { expensesApi } from '@/lib/api/expenses.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { formatDate } from '@/lib/utils/date';
import { normalizeApiError } from '@/lib/api/client';

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const { data: expenses, isLoading } = useQuery({ queryKey: ['expenses'], queryFn: () => expensesApi.list() });
  const { data: categories } = useQuery({ queryKey: ['expense-categories'], queryFn: () => expensesApi.listCategories() });
  
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [form, setForm] = useState({ category: '', description: '', amount: '', method: 'CASH' });
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  const createMutation = useMutation({
    mutationFn: () => expensesApi.create({ ...form, amount: Number(form.amount) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowForm(false);
      setForm({ category: '', description: '', amount: '', method: 'CASH' });
      toast.success('Expense recorded');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const createCategoryMutation = useMutation({
    mutationFn: () => expensesApi.createCategory(categoryForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      setShowCategoryForm(false);
      setForm(f => ({ ...f, category: categoryForm.name }));
      setCategoryForm({ name: '' });
      toast.success('Category created');
      setShowForm(true); // switch to add expense form
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div>
      <PageHeader
        title="Expenses"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setShowCategoryForm(true); setShowForm(false); }}>
              <Plus className="h-4 w-4" /> New Category
            </Button>
            <Button onClick={() => { setShowForm(true); setShowCategoryForm(false); }}>
              <Plus className="h-4 w-4" /> Add expense
            </Button>
          </div>
        }
      />

      {showCategoryForm && (
        <Card className="mb-4 border-brand/20 bg-brand/5">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCategoryMutation.mutate();
              }}
              className="flex items-end gap-3"
            >
              <div className="flex-1 max-w-sm">
                <Input label="Category Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" isLoading={createCategoryMutation.isPending}>
                  Save Category
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowCategoryForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

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
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-ink">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              <Input label="Amount" type="number" min={0} step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} required />
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
              data={expenses}
              emptyMessage="No expenses recorded yet."
              columns={[
                { header: 'Date', accessor: (e) => formatDate(e.expenseDate) },
                { header: 'Category', accessor: (e) => e.category },
                { header: 'Description', accessor: (e) => e.description ?? '—' },
                { header: 'Amount', accessor: (e) => <CurrencyDisplay amount={e.amount} size="sm" /> },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}



