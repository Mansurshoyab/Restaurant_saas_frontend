'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/shared/DataTable';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { Badge } from '@/components/ui/Badge';
import { normalizeApiError } from '@/lib/api/client';
import {
  usePlatformPlans,
  useCreatePlatformPlan,
  useUpdatePlatformPlan,
  useDeactivatePlatformPlan,
} from '@/lib/hooks/usePlatform';
import type { Plan } from '@/types/platform.types';

export default function PlansPage() {
  const { data: plans, isLoading } = usePlatformPlans();
  const createPlan = useCreatePlatformPlan();
  const updatePlan = useUpdatePlatformPlan();
  const deactivatePlan = useDeactivatePlatformPlan();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    billingCycle: 'MONTHLY' as 'MONTHLY' | 'YEARLY',
    price: '',
    branches: '',
    users: '',
    features: '',
    sortOrder: '0',
  });

  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      key: formData.key,
      billingCycle: formData.billingCycle,
      price: Number(formData.price),
      limits: {
        branches: Number(formData.branches),
        users: Number(formData.users),
      },
      features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      sortOrder: Number(formData.sortOrder),
    };

    try {
      if (editing) {
        await updatePlan.mutateAsync({ id: editing._id, payload });
        toast.success('Plan updated');
      } else {
        await createPlan.mutateAsync(payload);
        toast.success('Plan created');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setFormData({
      name: plan.name,
      key: plan.key,
      billingCycle: plan.billingCycle,
      price: plan.price.toString(),
      branches: plan.limits.branches.toString(),
      users: plan.limits.users.toString(),
      features: plan.features.join(', '),
      sortOrder: plan.sortOrder.toString(),
    });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({
      name: '',
      key: '',
      billingCycle: 'MONTHLY',
      price: '',
      branches: '',
      users: '',
      features: '',
      sortOrder: '0',
    });
    setShowForm(true);
  };

  const handleDeactivate = async () => {
    if (!deactivatingId) return;
    try {
      await deactivatePlan.mutateAsync(deactivatingId);
      toast.success('Plan deactivated');
      setDeactivatingId(null);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        action={
          <Button onClick={openCreate} disabled={showForm}>
            <Plus className="h-4 w-4" /> Add Plan
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Plan Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Key (e.g. basic, pro)"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  required
                />
                <Select
                  label="Billing Cycle"
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </Select>
                <Input
                  label="Price (BDT)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <Input
                  label="Branch Limit"
                  type="number"
                  value={formData.branches}
                  onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                  required
                />
                <Input
                  label="User Limit"
                  type="number"
                  value={formData.users}
                  onChange={(e) => setFormData({ ...formData, users: e.target.value })}
                  required
                />
                <Input
                  label="Sort Order"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Features (comma-separated)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" isLoading={createPlan.isPending || updatePlan.isPending}>
                  {editing ? 'Save Plan' : 'Create Plan'}
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
            <LoadingSpinner />
          ) : (
            <DataTable
              data={plans}
              columns={[
                { header: 'Name', accessor: (p) => <span className="font-medium text-ink">{p.name}</span> },
                {
                  header: 'Billing',
                  accessor: (p) => <span className="text-ink-muted">{p.billingCycle}</span>,
                },
                {
                  header: 'Price',
                  accessor: (p) => <CurrencyDisplay amount={p.price} />,
                },
                {
                  header: 'Limits',
                  accessor: (p) => (
                    <span className="text-sm text-ink-muted">
                      {p.limits.branches} branch, {p.limits.users} users
                    </span>
                  ),
                },
                {
                  header: 'Status',
                  accessor: (p) => (
                    <Badge variant={p.isActive ? 'success' : 'default'}>
                      {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  ),
                },
                {
                  header: '',
                  accessor: (p) => (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="text-ink-muted hover:text-brand">
                        <Pencil className="h-4 w-4" />
                      </button>
                      {p.isActive && (
                        <button onClick={() => setDeactivatingId(p._id)} className="text-ink-muted hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ),
                  className: 'w-24 text-right',
                },
              ]}
              emptyMessage="No plans configured."
            />
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        open={!!deactivatingId}
        title="Deactivate Plan"
        message="Are you sure you want to deactivate this plan? Existing subscriptions will remain active until they expire, but new organizations cannot subscribe to it."
        confirmLabel="Deactivate"
        danger
        isLoading={deactivatePlan.isPending}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivatingId(null)}
      />
    </div>
  );
}
