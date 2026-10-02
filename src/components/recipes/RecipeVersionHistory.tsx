import { formatDateTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import type { Recipe } from '@/types/recipe.types';

export function RecipeVersionHistory({ versions }: { versions: Recipe[] }) {
  if (!versions.length) return <p className="text-sm text-ink-muted">No recipe history yet.</p>;

  return (
    <div className="space-y-2">
      {versions.map((v: any) => (
        <div
          key={v._id}
          className={cn('flex items-center justify-between rounded-md border px-3 py-2 text-sm', v.active ? 'border-brand bg-brand-light' : 'border-slate-200')}
        >
          <span>
            Version {v.version} {v.active && <span className="ml-1 text-xs text-brand-hover">(active)</span>}
          </span>
          <span className="text-xs text-ink-muted">{formatDateTime(v.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}


