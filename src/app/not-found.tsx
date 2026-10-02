import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app px-4 text-center">
      <p className="text-sm font-medium text-ink-muted">404</p>
      <h1 className="mt-1 text-lg font-semibold text-ink">Page not found</h1>
      <p className="mt-1 text-sm text-ink-muted">The page you're looking for doesn't exist or was moved.</p>
      <Link href="/dashboard" className="mt-6">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
}


