'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useSubscriptionRequestDetail, useReviewSubscriptionRequest } from '@/lib/hooks/usePlatform';
import { toast } from 'sonner';
import { normalizeApiError } from '@/lib/api/client';

export default function SubscriptionRequestDetailPage({ params }: { params: { requestId: string } }) {
  const router = useRouter();
  const reqId = params.requestId;
  const { data: request, isLoading } = useSubscriptionRequestDetail(reqId);
  const reviewRequest = useReviewSubscriptionRequest();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    try {
      await reviewRequest.mutateAsync({ id: reqId, payload: { action: 'APPROVE' } });
      toast.success('Request approved');
      router.push('/platform/subscriptions/requests');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    try {
      await reviewRequest.mutateAsync({ id: reqId, payload: { action: 'REJECT', rejectionReason } });
      toast.success('Request rejected');
      setRejectDialogOpen(false);
      router.push('/platform/subscriptions/requests');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  if (isLoading) return <LoadingSpinner className="mt-20" />;
  if (!request) return <div className="text-danger">Failed to load request details.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Review Request" />
        {request.status === 'PENDING' && (
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => setRejectDialogOpen(true)}>
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              isLoading={reviewRequest.isPending}
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardBody className="py-5">
            <h3 className="mb-4 text-sm font-medium text-ink-muted">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Organization</span>
                <span className="font-medium text-ink">
                  {request.organization?.name || 
                   (typeof request.organizationId === 'object' && request.organizationId !== null ? (request.organizationId as any).name : request.organizationId)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Plan</span>
                <span className="font-medium text-ink">
                  {request.plan?.name || 
                   (typeof request.planId === 'object' && request.planId !== null ? (request.planId as any).name : request.planId)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Amount</span>
                <span className="font-bold text-ink"><CurrencyDisplay amount={request.amount} /></span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Sender bKash</span>
                <span className="font-medium text-ink">{request.senderBkashNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">TrxID</span>
                <span className="font-mono text-ink">{request.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-ink-muted">Status</span>
                <span className="font-medium text-ink">{request.status}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-muted">Submitted At</span>
                <span className="text-ink">{new Date(request.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {request.screenshotUrl && (
          <Card>
            <CardBody className="py-5">
              <h3 className="mb-4 text-sm font-medium text-ink-muted">Screenshot Evidence</h3>
              <div className="overflow-hidden rounded border border-slate-100">
                <img
                  src={request.screenshotUrl}
                  alt="Payment screenshot"
                  className="h-auto w-full max-w-full object-contain"
                />
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} title="Reject Request">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">Please provide a reason for rejecting this payment request. The organization owner will see this.</p>
          <Input
            placeholder="e.g. TrxID not found or amount incorrect"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" isLoading={reviewRequest.isPending} onClick={handleReject}>
              Reject Payment
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
