import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { isChunkLoadError, reloadOnceForStaleChunk } from '@/lib/lazy-with-retry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** When this value changes the boundary resets (e.g. on route change). */
  resetKey?: string;
  /** Render nothing instead of the error card (for non-critical widgets). */
  silent?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  resetKey?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, resetKey: props.resetKey };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) {
      return { resetKey: props.resetKey, hasError: false, error: null };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // A stale deployment leaves the open tab pointing at chunks that no longer
    // exist. One reload picks up the fresh build instead of showing an error.
    if (isChunkLoadError(error)) reloadOnceForStaleChunk();
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      if (this.props.fallback) return this.props.fallback;

      return (
        <div role="alert" className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              This part of the page failed to load. Trying again usually fixes it.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={this.handleRetry} variant="default">
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
