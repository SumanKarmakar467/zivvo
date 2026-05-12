const getColor = (score) => {
  if (score <= 40) return "text-red-400";
  if (score <= 70) return "text-amber-400";
  return "text-green-400";
};

export default function TrustScoreBadge({ score = 0 }) {
  const normalized = Math.max(0, Math.min(100, Number(score || 0)));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;
  const colorClass = getColor(normalized);

  return (
    <div title="Fulfillment rate · Avg rating · Return rate" className="inline-flex items-center gap-2">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" className="text-zivvo-dark-raised fill-none" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none transition-all ${colorClass}`}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="36" textAnchor="middle" className={`text-sm font-bold ${colorClass}`}>{normalized}</text>
      </svg>
      <div className="text-xs text-zivvo-text-muted">
        <p className="font-semibold text-zivvo-text-base">Trust Score</p>
        <p>0–100</p>
      </div>
    </div>
  );
}

