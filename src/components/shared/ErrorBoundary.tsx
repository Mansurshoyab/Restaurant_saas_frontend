'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="mb-3 h-8 w-8 text-danger" />
          <p className="font-medium text-ink">Something went wrong</p>
          <p className="mt-1 text-sm text-ink-muted">{this.state.error?.message ?? 'Please try again.'}</p>
          <Button className="mt-4" onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

