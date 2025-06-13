import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  // Update state when an error is thrown
  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null 
    };
  }

  // Log error details for debugging
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error);
    console.error('Error info:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  // Retry handler to reset error state and reload the page
  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback component is provided, use it
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent error={this.state.error!} />;
      }
      
      // Default fallback UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-[1px]">
                  <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Something went wrong</h2>
                  <p className="text-gray-400 text-sm">
                    An error occurred while loading the application.
                  </p>
                </div>
              </div>

              {this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <pre className="text-red-400 text-sm font-mono break-words">
                    {this.state.error.message}
                  </pre>
                </div>
              )}

              <button 
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                Retry
              </button>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl opacity-10 blur-xl -z-10" />
          </div>
        </div>
      );
    }

    // Render children if no error is caught
    return this.props.children;
  }
}
