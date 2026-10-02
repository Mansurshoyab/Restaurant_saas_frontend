'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrencyCompact } from '@/lib/utils/currency';

interface TimeseriesPoint {
  date: string;
  netSales: number;
  orderCount: number;
}

export function SalesTimeseriesChart({ data }: { data: TimeseriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={(v) => formatCurrencyCompact(v)}
          tick={{ fontSize: 12, fill: '#64748B' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip formatter={(value: number) => formatCurrencyCompact(value)} />
        <Line type="monotone" dataKey="netSales" stroke="#EA580C" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}


