'use client';

import { useState } from 'react';
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
import { normalizeApiError } from '@/lib/api/client';

export default function DiningAreasPage() {
  const queryClient = useQueryClient();
  const { data: areas, isLoading } = useQuery({ queryKey: ['dining-areas'], queryFn: tablesApi.listDiningAreas });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const createMutation = useMutation({
    mutationFn: (name: string) => tablesApi.createDiningArea(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dining-areas'] });
      setShowForm(false);
      setName('');
      toast.success('Dining area created');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div>
      <PageHeader
        title="Restaurant Management"
        description="Manage your staff, branches, and tables."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add dining area
          </Button>
        }
      />
      
      <RestaurantSubNav />

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(name);
              }}
              className="flex items-end gap-3"
            >
              <div className="flex-1">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
              </div>
              <Button type="submit" isLoading={createMutation.isPending}>
                Create
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
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable data={areas as any} emptyMessage="No dining areas yet." columns={[{ header: 'Name', accessor: (a: any) => a.name }]} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


