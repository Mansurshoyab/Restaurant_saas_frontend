'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { categoriesApi } from '@/lib/api/categories.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export function CategoryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (categoryId: string) => void;
}) {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list() });
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onChange(category._id);
      setCreating(false);
      setNewName('');
      toast.success('Category created');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  if (creating) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">New category</label>
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Burgers"
            autoFocus
            className="flex-1"
          />
          <Button
            type="button"
            size="sm"
            isLoading={createMutation.isPending}
            disabled={!newName.trim()}
            onClick={() => createMutation.mutate({ name: newName.trim() })}
          >
            Save
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setCreating(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink">Category</label>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover"
        >
          <Plus className="h-3 w-3" /> New category
        </button>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        required
      >
        <option value="">Select a category</option>
        {categories?.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}


