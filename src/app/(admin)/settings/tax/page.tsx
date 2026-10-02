'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsSubNav } from '@/components/settings/SettingsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export default function TaxSettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const [taxRatePercent, setTaxRatePercent] = useState(0);
  const [taxInclusive, setTaxInclusive] = useState(false);

  useEffect(() => {
    if (settings) {
      setTaxRatePercent(settings.taxRatePercent);
      setTaxInclusive(settings.taxInclusive);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Tax settings saved');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Tax"
        description="Applied automatically to every order."
      />

      <SettingsSubNav />

      <div className="max-w-md">
        <Card>
          <CardBody className="space-y-4">
            <Input
              label="Tax rate (%)"
              type="number"
              min={0}
              max={100}
              value={taxRatePercent}
              onChange={(e) => setTaxRatePercent(Number(e.target.value))}
            />

            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={taxInclusive}
                onChange={(e) => setTaxInclusive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              Prices already include tax
            </label>

            <Button
              isLoading={updateMutation.isPending}
              onClick={() =>
                updateMutation.mutate({
                  taxRatePercent,
                  taxInclusive,
                })
              }
            >
              Save
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}