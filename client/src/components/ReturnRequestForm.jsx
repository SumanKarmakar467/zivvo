import { useMemo, useState } from "react";
import api from "../api/axios";
import { notifyError, notifySuccess } from "./common/Toast";

const reasons = ["defective", "wrong_item", "not_as_described", "changed_mind", "damaged_in_transit", "other"];

export default function ReturnRequestForm({ order, onSubmitted }) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [payload, setPayload] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const deliveredEvent = useMemo(
    () => [...(order?.statusHistory || [])].reverse().find((item) => item.status === "delivered"),
    [order?.statusHistory]
  );
  const daysLeft = useMemo(() => {
    if (!deliveredEvent) return 0;
    const diff = Date.now() - new Date(deliveredEvent.timestamp).getTime();
    return Math.max(0, Math.ceil((7 * 24 * 60 * 60 * 1000 - diff) / (24 * 60 * 60 * 1000)));
  }, [deliveredEvent]);

  const totalRefund = useMemo(() => {
    return (order?.items || []).reduce((sum, item, idx) => {
      const key = `${item.product}-${item.variantSku || ""}-${idx}`;
      if (!selectedKeys.includes(key)) return sum;
      const qty = Number(payload[key]?.qty || item.quantity || 1);
      return sum + Number(item.price || 0) * qty;
    }, 0);
  }, [order?.items, payload, selectedKeys]);

  const toggle = (key) => {
    setSelectedKeys((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);
    setPayload((prev) => ({ ...prev, [key]: prev[key] || { reason: "defective", description: "", qty: 1, images: [] } }));
  };

  const submit = async () => {
    if (!selectedKeys.length) return notifyError("Select at least one item");
    const items = selectedKeys.map((key) => {
      const [productId, variantSku] = key.split("-");
      return {
        product: productId,
        variantSku: variantSku || "",
        qty: Number(payload[key]?.qty || 1),
        reason: payload[key]?.reason || "defective",
        description: payload[key]?.description || "",
        images: payload[key]?.images || []
      };
    });
    setSubmitting(true);
    try {
      await api.post("/returns", { orderId: order._id, items });
      notifySuccess("Return request submitted");
      if (onSubmitted) onSubmitted();
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to submit return");
    } finally {
      setSubmitting(false);
    }
  };

  if (order?.orderStatus !== "delivered") return null;
  if (daysLeft <= 0) return <p className="text-sm text-zivvo-text-soft">Return window closed</p>;

  return (
    <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
      <p className="text-sm font-semibold">Raise a return</p>
      <p className="mt-1 text-xs text-zivvo-text-soft">Return window closes in {daysLeft} day(s)</p>
      <div className="mt-3 space-y-3">
        {(order.items || []).map((item, idx) => {
          const key = `${item.product}-${item.variantSku || ""}-${idx}`;
          const selected = selectedKeys.includes(key);
          return (
            <div key={key} className="rounded-lg border border-zivvo-dark-raised p-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selected} onChange={() => toggle(key)} />
                <span>{item.name}</span>
              </label>
              {selected && (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <select value={payload[key]?.reason || "defective"} onChange={(e) => setPayload((prev) => ({ ...prev, [key]: { ...prev[key], reason: e.target.value } }))} className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-2 py-2 text-sm">
                    {reasons.map((reason) => <option key={reason} value={reason}>{reason.replaceAll("_", " ")}</option>)}
                  </select>
                  <input type="number" min="1" max={item.quantity} value={payload[key]?.qty || 1} onChange={(e) => setPayload((prev) => ({ ...prev, [key]: { ...prev[key], qty: Number(e.target.value || 1) } }))} className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-2 py-2 text-sm" />
                  <textarea value={payload[key]?.description || ""} onChange={(e) => setPayload((prev) => ({ ...prev, [key]: { ...prev[key], description: e.target.value } }))} placeholder="Description" rows={2} className="sm:col-span-2 rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-2 py-2 text-sm" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-zivvo-text-soft">Estimated refund: ₹{Number(totalRefund).toLocaleString("en-IN")}</p>
      <button type="button" disabled={submitting} onClick={submit} className="mt-3 rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">
        {submitting ? "Submitting..." : "Submit Return Request"}
      </button>
    </div>
  );
}

