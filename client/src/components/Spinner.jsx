export default function Spinner({ label = "Loading", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm text-[var(--muted)] ${className}`} role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#7C5CFC]" />
      <span>{label}</span>
    </span>
  );
}
