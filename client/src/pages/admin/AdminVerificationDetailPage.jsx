import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTransition from "../../components/common/PageTransition";
import api from "../../api/axios";
import { notifyError, notifySuccess } from "../../components/common/Toast";

export default function AdminVerificationDetailPage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get(`/verification/${sellerId}`);
      setSeller(data);
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to load seller details");
    }
  };
  useEffect(() => { load(); }, [sellerId]);

  const approve = async () => {
    try {
      await api.patch(`/verification/${sellerId}/approve`);
      notifySuccess("Seller approved");
      navigate("/admin/verification");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Approval failed");
    }
  };

  const reject = async () => {
    if (!rejectReason.trim()) return notifyError("Rejection reason is required");
    try {
      await api.patch(`/verification/${sellerId}/reject`, { rejectionNote: rejectReason });
      notifySuccess("Seller rejected");
      navigate("/admin/verification");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Rejection failed");
    }
  };

  const docs = seller?.verification?.documents || {};

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-6">
        {!seller && <p className="text-zivvo-text-muted">Loading...</p>}
        {seller && (
          <>
            <h1 className="text-2xl font-bold">{seller.name}</h1>
            <p className="text-sm text-zivvo-text-muted">{seller.email}</p>
            <div className="mt-4 grid gap-4 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4 sm:grid-cols-2">
              <p>GST: {docs.gstNumber || "-"}</p>
              <p>PAN: {docs.panNumber || "-"}</p>
              <p>Aadhaar last 4: {docs.aadhaarLast4 || "-"}</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[docs.gstCertUrl, docs.panCardUrl, docs.bankProofUrl].filter(Boolean).map((url) => (
                <img key={url} src={url} alt="document" className="h-48 w-full rounded border border-zivvo-dark-raised object-cover" />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={approve} className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white">Approve</button>
              <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason" className="min-w-[280px] rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" />
              <button onClick={reject} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Reject</button>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}

