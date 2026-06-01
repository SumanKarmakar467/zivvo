import { useCallback, useState } from "react";

export function useErrorHandler() {
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    console.error("Handled error:", err);
    setError(err);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const ErrorDisplay = error ? (
    <div className="flex w-full items-start gap-3 rounded-lg border border-red-800/50 bg-red-950/20 p-4">
      <span className="mt-0.5 text-lg text-red-400">!</span>
      <div className="flex-1">
        <p className="text-sm text-red-300">{error.message || "Something went wrong."}</p>
        <button type="button" onClick={clearError} className="mt-1 text-xs text-red-400 underline hover:text-red-300">
          Dismiss
        </button>
      </div>
    </div>
  ) : null;

  return { error, handleError, clearError, ErrorDisplay };
}

// const { handleError, ErrorDisplay } = useErrorHandler();
// In your async function: try { ... } catch(e) { handleError(e); }
// In JSX: {ErrorDisplay}
