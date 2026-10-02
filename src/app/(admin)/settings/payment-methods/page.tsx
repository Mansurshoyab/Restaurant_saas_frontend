'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsSubNav } from '@/components/settings/SettingsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PAYMENT_METHOD } from '@/lib/constants';
import { normalizeApiError } from '@/lib/api/client';

export default function PaymentMethodsSettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const [enabled, setEnabled] = useState<string[]>([]);

  useEffect(() => {
    if (settings) setEnabled(settings.paymentMethodsEnabled);
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Payment methods saved');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const toggle = (method: string) =>
    setEnabled((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  return (
    <div className="max-w-md">
      <PageHeader
        title="Payment methods"
        description="Which methods cashiers can select at checkout."
      />

      <SettingsSubNav />

      <Card>
        <CardBody className="space-y-3">
          {Object.values(PAYMENT_METHOD).map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 text-sm text-ink"
            >
              <input
                type="checkbox"
                checked={enabled.includes(method)}
                onChange={() => toggle(method)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {method}
            </label>
          ))}

          <Button
            isLoading={updateMutation.isPending}
            onClick={() =>
              updateMutation.mutate({
                paymentMethodsEnabled: enabled,
              })
            }
          >
            Save
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}


