import { useEffect, useState } from "react";
import api from "../../api/axios";
import { notifyError, notifySuccess } from "../../components/common/Toast";

const tabs = ["all", "requested", "approved", "rejected", "refunded"];

export default function SellerReturnsPage() {
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (status = tab) => {
    setLoading(true);
    try {
      const res = await api.get("/returns/seller", { params: { status: status === "all" ? undefined : status } });
      setItems(res.data);
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const approve = async (item) => {
    const note = prompt("Optional approval note") || "";
    try {
      await api.patch(`/returns/${item._id}/approve`, { sellerNote: note });
      notifySuccess("Return approved");
      load();
    } catch (error) {
      notifyError(error?.response?.data?.message || "Approval failed");
    }
  };

  const reject = async (item) => {
    const reason = prompt("Rejection reason (required)");
    if (!reason) return;
    try {
      await api.patch(`/returns/${item._id}/reject`, { reason });
      notifySuccess("Return rejected");
      load();
    } catch (error) {
      notifyError(error?.response?.data?.message || "Rejection failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#19120b] px-4 py-6 text-[#efe0d3] md:px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-2xl font-bold">Seller Returns</h1>
        <div className="mb-4 flex gap-2">
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-3 py-1 text-xs ${tab === t ? "bg-[#ef9f27] text-black" : "bg-zinc-800"}`}>{t}</button>
          ))}
        </div>
        {loading ? <div className="h-40 animate-pulse rounded-xl bg-zinc-800" /> : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#1f1a14]">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400">
                  <th className="px-3 py-2">Order</th><th>Buyer</th><th>Items</th><th>Refund</th><th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-zinc-800">
                    <td className="px-3 py-2">#{String(item.order?._id || item.order).slice(-6)}</td>
                    <td>{item.buyer?.name || "Buyer"}</td>
                    <td>{item.items?.length || 0}</td>
                    <td>₹{Number(item.refundAmount || 0).toLocaleString("en-IN")}</td>
                    <td><span className="rounded-full bg-zinc-800 px-2 py-1 text-xs">{item.status}</span></td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        {item.status === "requested" && (
                          <>
                            <button type="button" onClick={() => approve(item)} className="rounded bg-green-700 px-2 py-1 text-xs">Approve</button>
                            <button type="button" onClick={() => reject(item)} className="rounded bg-red-700 px-2 py-1 text-xs">Reject</button>
                          </>
                        )}
                        {item.razorpayRefundId && <span className="text-xs text-zinc-400">Refund: {item.razorpayRefundId}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

