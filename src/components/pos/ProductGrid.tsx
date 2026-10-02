'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useProducts } from '@/lib/hooks/useProducts';
import { categoriesApi } from '@/lib/api/categories.api';
import { useQuery } from '@tanstack/react-query';
import { ProductTile } from './ProductTile';
import type { MenuProduct } from '@/types/product.types';

export function ProductGrid({ onSelectProduct }: { onSelectProduct: (product: MenuProduct) => void }) {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list() });
  const { data: products, isLoading } = useProducts({ categoryId });

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3">
        <button
          onClick={() => setCategoryId(undefined)}
          className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium',
            !categoryId ? 'bg-ink text-white' : 'bg-slate-100 text-ink-muted hover:bg-slate-200'
          )}
        >
          All
        </button>
        {categories?.map((c) => (
          <button
            key={c._id}
            onClick={() => setCategoryId(c._id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium',
              categoryId === c._id ? 'bg-ink text-white' : 'bg-slate-100 text-ink-muted hover:bg-slate-200'
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-sm text-ink-muted">Loading menu…</p>
        ) : !products?.length ? (
          <p className="text-sm text-ink-muted">No products in this category.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => (
              <ProductTile key={p._id} product={p} onSelect={() => onSelectProduct(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


