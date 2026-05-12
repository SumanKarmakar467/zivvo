import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/common/PageTransition";
import api from "../../api/axios";
import { notifyError } from "../../components/common/Toast";

export default function AdminVerificationPage() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/verification/pending", { params: { status: statusFilter === "all" ? undefined : statusFilter } });
      setItems(data.sellers || []);
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to load verifications");
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold">Seller Verifications</h1>
        <div className="mt-3 flex gap-2">
          {["pending", "verified", "rejected", "all"].map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`rounded px-3 py-1 text-sm ${statusFilter === status ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised"}`}>
              {status}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zivvo-dark-raised">
          <table className="min-w-full text-sm">
            <thead className="bg-zivvo-dark-surface text-left">
              <tr><th className="p-3">Seller</th><th className="p-3">Email</th><th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className="border-t border-zivvo-dark-raised">
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.email}</td>
                  <td className="p-3">{row.verification?.submittedAt ? new Date(row.verification.submittedAt).toLocaleDateString("en-IN") : "-"}</td>
                  <td className="p-3">{row.verification?.status}</td>
                  <td className="p-3"><Link className="text-zivvo-amber-brand" to={`/admin/verification/${row._id}`}>Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}

