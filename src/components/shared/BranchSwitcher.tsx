'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Building2 } from 'lucide-react';
import { useState } from 'react';
import { branchesApi } from '@/lib/api/branches.api';
import { useUiStore } from '@/lib/stores/uiStore';
import { setActiveBranchHeader } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils/cn';

export function BranchSwitcher() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: branchesApi.list });
  const activeBranchId = useUiStore((s) => s.activeBranchId);
  const setActiveBranchId = useUiStore((s) => s.setActiveBranchId);

  // Single-branch restaurants never need this control cluttering the topbar.
  if (!branches || branches.length <= 1) return null;

  const activeBranch = branches.find((b) => b._id === activeBranchId) ?? branches[0];

  const handleSelect = (branchId: string) => {
    setActiveBranchId(branchId);
    setActiveBranchHeader(branchId);
    queryClient.invalidateQueries(); // every branch-scoped query needs to refetch
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-ink hover:bg-slate-50"
      >
        <Building2 className="h-3.5 w-3.5 text-ink-muted" />
        {activeBranch.name}
        <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {branches.map((b) => (
            <button
              key={b._id}
              onClick={() => handleSelect(b._id)}
              className={cn(
                'block w-full px-3 py-2 text-left text-sm hover:bg-slate-50',
                b._id === activeBranch._id ? 'font-medium text-brand' : 'text-ink'
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

