'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useProducts } from '@/lib/hooks/useProducts';
import { PageHeader } from '@/components/layout/PageHeader';
import { MenuSubNav } from '@/components/menu/MenuSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { UtensilsCrossed } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Your menu, as customers see it in the POS."
        action={
          <Link href="/menu/products/new">
            <Button>
              <Plus className="h-4 w-4" /> Add product
            </Button>
          </Link>
        }
      />

      <MenuSubNav />

      {isLoading ? (
        <LoadingSpinner />
      ) : !products?.length ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={UtensilsCrossed}
              title="No products yet"
              description="Add a category first, then create your first menu item."
              action={
                <Link href="/menu/categories">
                  <Button variant="secondary">Go to categories</Button>
                </Link>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((p) => (
            <button
              key={p._id}
              onClick={() => router.push(`/menu/products/${p._id}`)}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left hover:border-brand"
            >
              <div className="relative aspect-video bg-slate-50">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-faint">No image</div>
                )}
                {!p.isActive && (
                  <span className="absolute right-2 top-2 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-white">Inactive</span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                <CurrencyDisplay amount={p.price} size="sm" className="text-ink-muted" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


