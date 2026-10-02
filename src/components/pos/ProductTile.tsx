'use client';

import Image from 'next/image';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import type { MenuProduct } from '@/types/product.types';

export function ProductTile({ product, onSelect }: { product: MenuProduct; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-brand hover:shadow-sm"
    >
      <div className="relative aspect-square w-full bg-slate-50">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-semibold text-ink-faint">
            {product.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-sm font-medium text-ink">{product.name}</p>
        <CurrencyDisplay amount={product.price} size="sm" className="text-ink-muted" />
      </div>
    </button>
  );
}


