import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import type { RecipeCost } from '@/types/recipe.types';
import { cn } from '@/lib/utils/cn';

export function FoodCostBreakdown({ cost }: { cost: RecipeCost }) {
  const pct = cost.foodCostPercent;
  const pctColor = pct === null ? 'text-ink-muted' : pct > 40 ? 'text-danger' : pct > 30 ? 'text-warning' : 'text-success';

  return (
    <div className="space-y-3">
      <div className="divide-y divide-slate-100">
        {cost.breakdown.map((line) => (
          <div key={line.inventoryItemId} className="flex justify-between py-1.5 text-sm">
            <span className="text-ink-muted">
              {line.quantity} {line.unit} {line.name}
            </span>
            <CurrencyDisplay amount={line.cost} size="sm" />
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-slate-200 pt-2 font-medium">
        <span>Food cost</span>
        <CurrencyDisplay amount={cost.totalFoodCost} />
      </div>

      {cost.sellingPrice !== null && (
        <div className="rounded-md bg-slate-50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Selling price</span>
            <CurrencyDisplay amount={cost.sellingPrice} size="sm" />
          </div>
          <div className={cn('mt-1 flex justify-between font-medium', pctColor)}>
            <span>Food cost %</span>
            <span className="tabular">{pct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}


