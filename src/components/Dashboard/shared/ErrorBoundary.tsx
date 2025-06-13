import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-medium">Something went wrong</h3>
          </div>
          <p className="text-gray-400 text-sm">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}