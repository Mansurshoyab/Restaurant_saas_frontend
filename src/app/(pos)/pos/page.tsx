'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/stores/cartStore';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CartPanel } from '@/components/pos/CartPanel';
import { ModifierPicker } from '@/components/pos/ModifierPicker';
import type { MenuProduct } from '@/types/product.types';

export default function PosPage() {
  const router = useRouter();
  const { orderType, addLine } = useCartStore();
  const [pickingProduct, setPickingProduct] = useState<MenuProduct | null>(null);

  if (!orderType) {
    router.replace('/pos/tables');
    return null;
  }

  return (
    <div className="grid h-full grid-cols-[1fr_360px]">
      <ProductGrid onSelectProduct={setPickingProduct} />
      <CartPanel />

      {pickingProduct && (
        <ModifierPicker
          product={pickingProduct}
          onCancel={() => setPickingProduct(null)}
          onConfirm={(selections) => {
            addLine({
              productId: pickingProduct._id,
              productName: pickingProduct.name,
              unitPrice: pickingProduct.price,
              quantity: 1,
              modifierIds: selections.map((s) => s.modifierId),
              modifierLabels: selections.map((s) => s.name),
              modifierTotal: selections.reduce((sum, s) => sum + s.price, 0),
            });
            setPickingProduct(null);
          }}
        />
      )}
    </div>
  );
}


