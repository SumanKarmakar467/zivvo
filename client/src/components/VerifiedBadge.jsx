export default function VerifiedBadge({ size = "sm" }) {
  const sizeMap = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1"
  };

  return (
    <span
      title="Verified seller — documents reviewed by Zivvo"
      className={`inline-flex items-center gap-1 rounded-full bg-blue-500/20 text-blue-300 ${sizeMap[size] || sizeMap.sm}`}
    >
      <span>✓</span>
      <span>Verified</span>
    </span>
  );
}

