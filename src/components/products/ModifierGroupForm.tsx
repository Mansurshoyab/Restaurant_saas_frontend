'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

export interface ModifierGroupFormValues {
  name: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  required: boolean;
}

export function ModifierGroupForm({
  initial,
  onSubmit,
  isSubmitting,
}: {
  initial?: Partial<ModifierGroupFormValues>;
  onSubmit: (values: ModifierGroupFormValues) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<ModifierGroupFormValues>({
    name: initial?.name ?? '',
    selectionType: initial?.selectionType ?? 'MULTIPLE',
    required: initial?.required ?? false,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="grid grid-cols-3 gap-3"
    >
      <Input label="Group name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Add-ons" required />
      <Select
        label="Selection type"
        value={form.selectionType}
        onChange={(e) => setForm((f) => ({ ...f, selectionType: e.target.value as 'SINGLE' | 'MULTIPLE' }))}
      >
        <option value="MULTIPLE">Multiple (add-ons)</option>
        <option value="SINGLE">Single (size, etc.)</option>
      </Select>
      <div className="flex items-end pb-2.5">
        <Checkbox label="Required" checked={form.required} onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))} />
      </div>
      <div className="col-span-3">
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}


