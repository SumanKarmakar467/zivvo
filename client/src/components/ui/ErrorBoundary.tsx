import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-5 text-6xl">!</div>
        <h2 className="mb-3 font-serif text-3xl font-bold text-[var(--cream)]">Something went wrong</h2>
        <p className="mb-7 max-w-md text-sm leading-7 text-[var(--muted)]">We encountered an unexpected error. Please try refreshing the page.</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] px-6 py-3 text-sm font-semibold text-white">Refresh Page</button>
          <button type="button" onClick={() => { window.location.href = "/"; }} className="rounded-full border border-[rgba(124,92,252,0.4)] px-6 py-3 text-sm text-[var(--cream)]">Go Home</button>
        </div>
        {import.meta.env.DEV && this.state.error && (
          <pre className="mt-6 max-w-2xl overflow-auto rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-left text-xs text-rose-400">
            {this.state.error.toString()}
            {this.state.errorInfo?.componentStack}
          </pre>
        )}
      </motion.div>
    );
  }
}

export default ErrorBoundary;
