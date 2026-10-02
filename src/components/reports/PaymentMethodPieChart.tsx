'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils/currency';

const COLORS = ['#EA580C', '#0F172A', '#16A34A', '#D97706', '#64748B'];

export function PaymentMethodPieChart({ data }: { data: Array<{ method: string; total: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="method" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}



