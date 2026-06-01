const steps = ["payment_confirmed", "processing", "shipped", "delivered"];

const labels = {
  payment_confirmed: "Payment Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered"
};

const normalizeStatus = (status) => {
  if (status === "confirmed") return "payment_confirmed";
  if (status === "out_for_delivery") return "shipped";
  if (status === "placed" || status === "payment_pending") return "payment_confirmed";
  return status;
};

export default function OrderTimeline({ statusHistory = [], currentStatus = "payment_pending" }) {
  const normalizedStatus = normalizeStatus(currentStatus);
  const currentIndex = Math.max(steps.indexOf(normalizedStatus), 0);
  const byStatus = statusHistory.reduce((acc, item) => {
    acc[normalizeStatus(item.status)] = item;
    return acc;
  }, {});

  return (
    <div className="space-y-0">
      {steps.map((status, idx) => {
        const completed = idx < currentIndex;
        const current = idx === currentIndex;
        const info = byStatus[status];
        return (
          <div key={status} className="relative pb-7 pl-10 last:pb-0">
            {idx !== steps.length - 1 && (
              <span
                className={`absolute left-[11px] top-6 h-[calc(100%-6px)] w-0.5 ${
                  completed ? "bg-violet-500" : "border-l border-dashed border-violet-900"
                }`}
              />
            )}
            <span
              className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                completed || current ? "bg-violet-600 text-white animate-pulse" : "border border-violet-700 text-violet-500"
              }`}
            >
              {completed ? "✓" : ""}
            </span>
            <p className={`text-sm font-semibold ${completed ? "text-violet-200" : current ? "text-cyan-200" : "text-zinc-500"}`}>{labels[status]}</p>
            <p className="text-xs text-zivvo-text-soft">{info?.timestamp ? new Date(info.timestamp).toLocaleString() : "Pending"}</p>
            {info?.note ? <p className="text-xs text-zivvo-text-muted">{info.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
