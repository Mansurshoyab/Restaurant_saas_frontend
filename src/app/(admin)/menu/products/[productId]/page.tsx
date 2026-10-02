'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useProduct, useUpdateProduct } from '@/lib/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductImageUploader } from '@/components/products/ProductImageUploader';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { normalizeApiError } from '@/lib/api/client';

export default function EditProductPage({ params }: { params: { productId: string } }) {
  const { data: product, isLoading } = useProduct(params.productId);
  const updateProduct = useUpdateProduct();

  if (isLoading || !product) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="max-w-lg space-y-4">
      <PageHeader
        title={product.name}
        action={
          <Link href={`/menu/products/${product._id}/recipe`} className="text-sm font-medium text-brand hover:text-brand-hover">
            Manage recipe →
          </Link>
        }
      />

      <Card>
        <CardBody className="space-y-5">
          <ProductImageUploader productId={product._id} currentImageUrl={product.imageUrl} />
          <ProductForm
            initial={product}
            isSubmitting={updateProduct.isPending}
            onSubmit={async (payload) => {
              try {
                await updateProduct.mutateAsync({ id: product._id, payload });
                toast.success('Product updated');
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


