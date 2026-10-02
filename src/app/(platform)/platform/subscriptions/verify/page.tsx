'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { usePlatformOrganizations, usePlatformPlans, useVerifySubscriptionPayment } from '@/lib/hooks/usePlatform';
import { normalizeApiError } from '@/lib/api/client';

export default function VerifyPaymentPage() {
  const router = useRouter();
  const { data: orgsResponse } = usePlatformOrganizations({ limit: 1000 }); // simplified for v1
  const orgs = orgsResponse?.data;
  const { data: plans } = usePlatformPlans();
  const verifyPayment = useVerifySubscriptionPayment();

  const [formData, setFormData] = useState({
    organizationId: '',
    planId: '',
    amount: '',
    paymentReference: '',
    periodDays: '30',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationId || !formData.planId) {
      toast.error('Please select an organization and a plan.');
      return;
    }

    try {
      await verifyPayment.mutateAsync({
        organizationId: formData.organizationId,
        planId: formData.planId,
        amount: Number(formData.amount),
        paymentReference: formData.paymentReference,
        periodDays: Number(formData.periodDays),
        notes: formData.notes,
      });
      toast.success('Payment verified and subscription activated');
      router.push('/platform/organizations/' + formData.organizationId);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manual Payment Verification"
        description="Bypass the request queue and verify a payment directly."
      />

      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Select
                label="Organization"
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                required
              >
                <option value="">-- Select Organization --</option>
                {orgs?.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Plan"
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                required
              >
                <option value="">-- Select Plan --</option>
                {plans?.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} (৳{plan.price}/{plan.billingCycle})
                  </option>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Amount Paid (BDT)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <Input
                  label="Period (Days)"
                  type="number"
                  value={formData.periodDays}
                  onChange={(e) => setFormData({ ...formData, periodDays: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Payment Reference (TrxID / Receipt No)"
                value={formData.paymentReference}
                onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                required
              />

              <Input
                label="Internal Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              <div className="pt-2">
                <Button type="submit" isLoading={verifyPayment.isPending} className="w-full">
                  Verify Payment & Activate Subscription
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
