import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
    // TODO: send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { level = "page", onReset } = this.props;

    if (level === "page") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#05060F] px-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-violet-700 bg-violet-900/40">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-sm text-violet-300">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  onReset?.();
                }}
                className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="rounded-lg border border-violet-600 px-6 py-2 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-900/40"
              >
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-violet-400">Dev: Error details</summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded border border-red-900 bg-red-950/20 p-3 text-xs text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    if (level === "section") {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-violet-800/40 bg-violet-950/10 py-12">
          <span className="text-2xl">!</span>
          <p className="px-4 text-center text-sm text-violet-300">
            {this.props.fallbackMessage || "This section failed to load."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="text-xs text-cyan-400 underline transition-colors hover:text-cyan-300"
          >
            Retry
          </button>
        </div>
      );
    }

    if (level === "widget") {
      return (
        <div className="rounded-lg border border-red-900/40 bg-red-950/10 p-3">
          <p className="text-xs text-red-400">{this.props.fallbackMessage || "Failed to load."}</p>
        </div>
      );
    }

    return null;
  }
}
