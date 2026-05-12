const steps = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const labels = {
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered"
};

export default function OrderTimeline({ statusHistory = [], currentStatus = "placed" }) {
  const currentIndex = Math.max(steps.indexOf(currentStatus), 0);
  const byStatus = statusHistory.reduce((acc, item) => {
    acc[item.status] = item;
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
                  completed ? "bg-green-500" : "border-l border-dashed border-zinc-600"
                }`}
              />
            )}
            <span
              className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                completed ? "bg-green-500 text-black" : current ? "bg-green-500 text-black animate-pulse" : "border border-zinc-600 text-zinc-500"
              }`}
            >
              {completed ? "✓" : ""}
            </span>
            <p className="text-sm font-semibold">{labels[status]}</p>
            <p className="text-xs text-zivvo-text-soft">{info?.timestamp ? new Date(info.timestamp).toLocaleString() : "Pending"}</p>
            {info?.note ? <p className="text-xs text-zivvo-text-muted">{info.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
