import ErrorBoundary from "./ErrorBoundary";

export function withErrorBoundary(Component, boundaryProps = {}) {
  return function WrappedWithErrorBoundary(props) {
    return (
      <ErrorBoundary {...boundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
