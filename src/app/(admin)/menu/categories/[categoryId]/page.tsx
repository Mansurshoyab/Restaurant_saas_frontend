'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoriesApi } from '@/lib/api/categories.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { normalizeApiError } from '@/lib/api/client';

export default function CategoryDetailPage({ params }: { params: { categoryId: string } }) {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list({ includeInactive: true }) });
  const category = categories?.find((c) => c._id === params.categoryId);

  const [form, setForm] = useState({ name: '', sortOrder: 0, isActive: true });

  useEffect(() => {
    if (category) setForm({ name: category.name, sortOrder: category.sortOrder, isActive: category.isActive });
  }, [category]);

  const updateMutation = useMutation({
    mutationFn: () => categoriesApi.update(params.categoryId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  if (isLoading || !category) return <LoadingSpinner />;

  return (
    <div className="max-w-md">
      <PageHeader title={category.name} />
      <Card>
        <CardBody className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input
            label="Sort order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
          <Checkbox
            label="Active (visible on POS)"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          <Button isLoading={updateMutation.isPending} onClick={() => updateMutation.mutate()}>
            Save
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}


