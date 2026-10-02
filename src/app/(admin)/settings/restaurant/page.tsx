'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings.api';
import { useUploadLogo } from '@/lib/hooks/useSettings';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsSubNav } from '@/components/settings/SettingsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export default function RestaurantSettingsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });
  
  const uploadLogo = useUploadLogo();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    receiptHeader: '',
    receiptFooter: '',
    currency: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name ?? '',
        phone: settings.phone ?? '',
        receiptHeader: settings.receiptHeader ?? '',
        receiptFooter: settings.receiptFooter ?? '',
        currency: settings.currency,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadLogo.mutateAsync(file);
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="Restaurant settings" />

      <SettingsSubNav />

      <div className="max-w-md">
        <Card>
          <CardBody className="space-y-4">
            <Input
              label="Restaurant Name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
            />

            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Restaurant Logo</label>
              <div className="flex items-center gap-4">
                {settings?.logo && (
                  <img src={settings.logo} alt="Logo" className="h-16 w-16 rounded-md object-contain border border-slate-200" />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    isLoading={uploadLogo.isPending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Logo
                  </Button>
                </div>
              </div>
            </div>

            <Input
              label="Currency code"
              value={form.currency}
              onChange={(e) =>
                setForm((f) => ({ ...f, currency: e.target.value }))
              }
              maxLength={3}
            />

            <Input
              label="Receipt header"
              value={form.receiptHeader}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  receiptHeader: e.target.value,
                }))
              }
            />

            <Input
              label="Receipt footer"
              value={form.receiptFooter}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  receiptFooter: e.target.value,
                }))
              }
            />

            <Button
              isLoading={updateMutation.isPending}
              onClick={() => updateMutation.mutate(form)}
            >
              Save
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


