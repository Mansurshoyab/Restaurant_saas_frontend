'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus } from 'lucide-react';
import { modifiersApi } from '@/lib/api/modifiers.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export default function ModifierGroupDetailPage({ params }: { params: { groupId: string } }) {
  const queryClient = useQueryClient();
  const { data: groups } = useQuery({ queryKey: ['modifiers', 'groups'], queryFn: modifiersApi.listGroups });
  const group = groups?.find((g) => g._id === params.groupId);

  const [newModifier, setNewModifier] = useState({ name: '', price: '' });

  const addMutation = useMutation({
    mutationFn: () => modifiersApi.addModifier(params.groupId, { name: newModifier.name, price: Number(newModifier.price) || 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modifiers', 'groups'] });
      setNewModifier({ name: '', price: '' });
      toast.success('Option added');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => modifiersApi.deleteModifier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modifiers', 'groups'] });
      toast.success('Option removed');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  if (!group) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="max-w-md">
      <PageHeader title={group.name} description={`${group.selectionType === 'SINGLE' ? 'Single choice' : 'Multiple choices'}${group.required ? ' · Required' : ''}`} />

      <Card>
        <CardBody className="space-y-3">
          {group.modifiers?.map((m) => (
            <div key={m._id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
              <span>{m.name}</span>
              <div className="flex items-center gap-3">
                <span className="tabular text-ink-muted">{m.price > 0 ? `+${m.price}` : 'Free'}</span>
                <button onClick={() => deleteMutation.mutate(m._id)} className="text-ink-faint hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMutation.mutate();
            }}
            className="flex items-end gap-2 border-t border-slate-100 pt-3"
          >
            <div className="flex-1">
              <Input label="Option name" value={newModifier.name} onChange={(e) => setNewModifier((m) => ({ ...m, name: e.target.value }))} required />
            </div>
            <div className="w-24">
              <Input
                label="Price"
                type="number"
                min={0}
                step="0.01"
                value={newModifier.price}
                onChange={(e) => setNewModifier((m) => ({ ...m, price: e.target.value }))}
              />
            </div>
            <Button type="submit" isLoading={addMutation.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


