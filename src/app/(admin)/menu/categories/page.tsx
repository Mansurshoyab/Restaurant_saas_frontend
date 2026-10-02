'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil } from 'lucide-react';
import { categoriesApi } from '@/lib/api/categories.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { MenuSubNav } from '@/components/menu/MenuSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { FolderPlus } from 'lucide-react';
import { normalizeApiError } from '@/lib/api/client';
import type { Category } from '@/types/product.types';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list() });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowForm(false);
      setName('');
      toast.success('Category created');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => categoriesApi.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditing(null);
      toast.success('Category updated');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing._id, name });
    } else {
      createMutation.mutate({ name });
    }
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group your menu items — Burgers, Pizza, Drinks."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add category
          </Button>
        }
      />

      <MenuSubNav />

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex-1">
                <Input label="Category name" value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
              </div>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                {editing ? 'Save' : 'Create'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : !categories?.length ? (
            <EmptyState
              icon={FolderPlus}
              title="No categories yet"
              description="Categories group your products on the POS screen — start with something like Burgers or Drinks."
              action={<Button onClick={openCreate}>Add your first category</Button>}
            />
          ) : (
            <DataTable
              data={categories}
              columns={[
                { header: 'Name', accessor: (c) => c.name },
                { header: 'Sort order', accessor: (c) => c.sortOrder },
                {
                  header: '',
                  accessor: (c) => (
                    <button onClick={() => openEdit(c)} className="text-ink-muted hover:text-brand">
                      <Pencil className="h-4 w-4" />
                    </button>
                  ),
                  className: 'w-10 text-right',
                },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


