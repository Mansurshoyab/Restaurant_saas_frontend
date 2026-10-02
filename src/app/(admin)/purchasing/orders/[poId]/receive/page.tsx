'use client';

import { usePurchaseOrder } from '@/lib/hooks/usePurchases';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { GoodsReceivingForm } from '@/components/purchases/GoodsReceivingForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function ReceiveGoodsPage({ params }: { params: { poId: string } }) {
  const router = useRouter();
  const { data: po, isLoading } = usePurchaseOrder(params.poId);

  if (isLoading || !po) return <LoadingSpinner />;

  return (
    <div className="max-w-lg">
      <PageHeader title={`Receive goods — ${po.poNumber}`} />
      <Card>
        <CardBody>
          <GoodsReceivingForm po={po} onDone={() => router.push(`/purchasing/orders/${po._id}`)} />
        </CardBody>
      </Card>
    </div>
  );
}


