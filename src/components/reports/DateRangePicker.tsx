'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function DateRangePicker({
  onChange,
}: {
  onChange: (range: { from?: string; to?: string }) => void;
}) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <div className="flex items-end gap-2">
      <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      <Button
        variant="secondary"
        onClick={() =>
          onChange({
            from: from ? new Date(from).toISOString() : undefined,
            to: to ? new Date(new Date(to).setHours(23, 59, 59)).toISOString() : undefined,
          })
        }
      >
        Apply
      </Button>
    </div>
  );
}


