'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateProduct } from '@/lib/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { normalizeApiError } from '@/lib/api/client';

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  return (
    <div className="max-w-lg">
      <PageHeader title="Add product" />
      <Card>
        <CardBody>
          <ProductForm
            isSubmitting={createProduct.isPending}
            onSubmit={async (payload) => {
              try {
                const product = await createProduct.mutateAsync(payload);
                toast.success('Product created');
                router.push(`/menu/products/${product._id}`);
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



