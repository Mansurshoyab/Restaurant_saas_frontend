import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

interface Profitability {
  revenue: number;
  foodCost: number;
  discounts: number;
  expenses: number;
  estimatedProfit: number;
  note: string;
}

export function ProfitabilityBreakdown({ data }: { data: Profitability }) {
  const rows = [
    { label: 'Revenue', value: data.revenue, sign: '' },
    { label: 'Food cost', value: -data.foodCost, sign: '-' },
    { label: 'Discounts', value: -data.discounts, sign: '-' },
    { label: 'Expenses', value: -data.expenses, sign: '-' },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between border-b border-slate-100 py-2 text-sm">
          <span className="text-ink-muted">{row.label}</span>
          <span className="tabular">
            {row.sign}
            <CurrencyDisplay amount={Math.abs(row.value)} size="sm" />
          </span>
        </div>
      ))}
      <div className="flex justify-between pt-2 font-semibold">
        <span>Estimated profit</span>
        <CurrencyDisplay amount={data.estimatedProfit} size="lg" className={data.estimatedProfit >= 0 ? 'text-success' : 'text-danger'} />
      </div>
      <p className="pt-1 text-xs text-ink-faint">{data.note}</p>
    </div>
  );
}


