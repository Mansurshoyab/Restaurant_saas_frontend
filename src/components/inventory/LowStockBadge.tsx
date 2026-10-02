import { AlertTriangle } from 'lucide-react';

export function LowStockList({
  items,
}: {
  items: Array<{ inventoryItemId: { name: string; unit: string }; quantity: number; reorderLevel: number }>;
}) {
  if (!items.length) {
    return <p className="text-sm text-ink-muted">Nothing is low on stock right now.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.inventoryItemId.name} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-ink">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            {item.inventoryItemId.name}
          </span>
          <span className="tabular text-ink-muted">
            {item.quantity} / {item.reorderLevel} {item.inventoryItemId.unit}
          </span>
        </li>
      ))}
    </ul>
  );
}

