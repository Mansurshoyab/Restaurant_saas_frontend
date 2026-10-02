'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateStaff } from '@/lib/hooks/useStaff';
import { StaffForm } from '@/components/staff/StaffForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { normalizeApiError } from '@/lib/api/client';

export default function NewStaffPage() {
  const router = useRouter();
  const createStaff = useCreateStaff();

  return (
    <div className="max-w-lg">
      <PageHeader title="Add staff" />
      <Card>
        <CardBody>
          <StaffForm
            isSubmitting={createStaff.isPending}
            onSubmit={async (payload) => {
              try {
                const staff = await createStaff.mutateAsync(payload);
                toast.success('Staff account created');
                router.push(`/restaurant/staff/${staff._id}`);
              } catch (err) {
                toast.error(normalizeApiError(err).message);
              }
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}


