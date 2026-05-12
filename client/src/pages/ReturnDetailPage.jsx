import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ReturnStatusTimeline from "../components/ReturnStatusTimeline";

export default function ReturnDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const res = await api.get(`/returns/${id}`);
        setData(res.data);
        setStatus("succeeded");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load return");
        setStatus("failed");
      }
    };
    load();
  }, [id]);

  if (status === "loading") return <main className="min-h-screen p-6"><div className="h-40 animate-pulse rounded-xl bg-zinc-800" /></main>;
  if (status === "failed") return <main className="min-h-screen p-6 text-red-300">{error}</main>;

  return (
    <main className="min-h-screen bg-zivvo-dark-bg px-4 py-6 text-zivvo-text-base md:px-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold">Return #{String(data._id).slice(-6).toUpperCase()}</h1>
        <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
          <p className="text-sm font-semibold">Refund amount: ₹{Number(data.refundAmount || 0).toLocaleString("en-IN")}</p>
          <div className="mt-3 space-y-2">
            {(data.items || []).map((item, idx) => (
              <div key={`${item.product?._id || idx}`} className="rounded-lg border border-zivvo-dark-raised p-2 text-sm">
                <p>{item.product?.name || "Item"}</p>
                <p className="text-zivvo-text-soft">Reason: {item.reason.replaceAll("_", " ")}</p>
              </div>
            ))}
          </div>
        </div>
        <ReturnStatusTimeline request={data} />
      </div>
    </main>
  );
}

