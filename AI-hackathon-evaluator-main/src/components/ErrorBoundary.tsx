import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A standard React Error Boundary to catch UI crashes.
 * Note: Error Boundaries must be class components in React.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 text-white font-rajdhani">
          <div className="max-w-md w-full text-center space-y-6 bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-orbitron font-bold text-white tracking-tighter">
                CRITICAL_SYSTEM_ERROR
              </h1>
              <p className="text-gray-400 text-lg">
                The application encountered an unrecoverable exception.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                <p className="text-[10px] font-mono text-red-400/80 mb-1 uppercase tracking-widest">Error Logs:</p>
                <p className="text-xs font-mono text-red-400 break-all leading-relaxed">
                   [{this.state.error.name}]: {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-orbitron font-bold text-sm tracking-wider rounded transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                REBOOT_SYSTEM
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-orbitron text-sm tracking-widest rounded transition-all border border-white/10"
              >
                RETURN_TO_CORE
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
