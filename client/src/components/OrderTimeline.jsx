const steps = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"];

const labels = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered"
};

export default function OrderTimeline({ statusHistory = [], currentStatus = "placed" }) {
  const normalizedStatus = currentStatus === "processing" ? "confirmed" : currentStatus;
  const currentIndex = Math.max(steps.indexOf(normalizedStatus), 0);
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
                completed ? "bg-green-500 text-black" : current ? "bg-[#7C5CFC] text-white animate-pulse" : "border border-zinc-600 text-zinc-500"
              }`}
            >
              {completed ? "✓" : ""}
            </span>
            <p className={`text-sm font-semibold ${completed ? "text-green-300" : current ? "text-[#A78BFA]" : "text-zinc-500"}`}>{labels[status]}</p>
            <p className="text-xs text-zivvo-text-soft">{info?.timestamp ? new Date(info.timestamp).toLocaleString() : "Pending"}</p>
            {info?.note ? <p className="text-xs text-zivvo-text-muted">{info.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
