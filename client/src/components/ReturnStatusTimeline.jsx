const steps = ["requested", "approved", "refund_initiated", "refunded"];
const labels = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  refund_initiated: "Refund Initiated",
  refunded: "Refunded",
  closed: "Closed"
};

export default function ReturnStatusTimeline({ request }) {
  const statusHistory = request?.statusHistory || [];
  const map = statusHistory.reduce((acc, item) => ({ ...acc, [item.status]: item }), {});
  const current = request?.status || "requested";
  const currentIdx = Math.max(steps.indexOf(current), 0);

  return (
    <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
      <h3 className="mb-3 text-sm font-semibold">Return Timeline</h3>
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const reached = idx <= currentIdx || map[step];
          const isCurrent = step === current;
          const info = map[step];
          return (
            <div key={step} className="relative pb-6 pl-10 last:pb-0">
              {idx !== steps.length - 1 && <span className={`absolute left-[11px] top-6 h-[calc(100%-6px)] w-0.5 ${idx < currentIdx ? "bg-green-500" : "bg-zinc-700"}`} />}
              <span className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs ${reached ? "bg-green-500 text-black" : "bg-zinc-700"} ${isCurrent ? "animate-pulse" : ""}`}>
                {reached ? "✓" : ""}
              </span>
              <p className="text-sm font-semibold">{labels[step]}</p>
              <p className="text-xs text-zivvo-text-soft">{info?.timestamp ? new Date(info.timestamp).toLocaleString() : "Pending"}</p>
            </div>
          );
        })}
      </div>
      {request?.status === "rejected" && <p className="mt-2 text-sm text-red-400">Rejected: {request.sellerNote || "No reason provided"}</p>}
      {request?.status === "refund_initiated" && (
        <p className="mt-2 text-sm text-zivvo-text-soft">Expected in 5-7 business days. Refund ID: {request.razorpayRefundId || "Pending"}</p>
      )}
    </div>
  );
}

