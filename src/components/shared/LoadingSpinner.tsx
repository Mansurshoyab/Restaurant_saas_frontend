import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function LoadingSpinner({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 py-10 text-sm text-ink-muted', className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

