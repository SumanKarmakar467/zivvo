import { useEffect, useState } from "react";
import PageTransition from "../../components/common/PageTransition";
import api from "../../api/axios";
import VerifiedBadge from "../../components/VerifiedBadge";
import TrustScoreBadge from "../../components/TrustScoreBadge";
import { notifyError, notifySuccess } from "../../components/common/Toast";

const emptyForm = {
  gstNumber: "",
  panNumber: "",
  aadhaarLast4: "",
  gstCertUrl: "",
  panCardUrl: "",
  bankProofUrl: ""
};

export default function SellerVerificationPage() {
  const [status, setStatus] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setStatus("loading");
    try {
      const { data } = await api.get("/verification/status");
      setProfile(data);
      setForm(data?.verification?.documents || emptyForm);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      notifyError(err?.response?.data?.message || "Failed to load verification status");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/verification/submit", form);
      notifySuccess("Verification submitted");
      await load();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const verificationStatus = profile?.verification?.status || "unverified";

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="text-2xl font-bold">Seller Verification</h1>
        {status === "loading" && <p className="mt-4 text-zivvo-text-muted">Loading...</p>}
        {status === "succeeded" && (
          <>
            {verificationStatus === "verified" && (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-green-300">Your account is verified</h2>
                    <div className="mt-2"><VerifiedBadge size="lg" /></div>
                  </div>
                  <TrustScoreBadge score={profile?.trustScore || 0} />
                </div>
              </div>
            )}

            {verificationStatus === "pending" && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
                Documents under review since {new Date(profile?.verification?.submittedAt).toLocaleDateString("en-IN")}
              </div>
            )}

            {(verificationStatus === "unverified" || verificationStatus === "rejected") && (
              <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4 sm:grid-cols-2">
                {verificationStatus === "rejected" && (
                  <p className="sm:col-span-2 rounded border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300">
                    Rejected: {profile?.verification?.rejectionNote || "Please update documents and resubmit."}
                  </p>
                )}
                <input value={form.gstNumber} onChange={(e) => setForm((s) => ({ ...s, gstNumber: e.target.value.toUpperCase() }))} placeholder="GST Number" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
                <input value={form.panNumber} onChange={(e) => setForm((s) => ({ ...s, panNumber: e.target.value.toUpperCase() }))} placeholder="PAN Number" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
                <input value={form.aadhaarLast4} onChange={(e) => setForm((s) => ({ ...s, aadhaarLast4: e.target.value }))} placeholder="Aadhaar Last 4" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
                <input value={form.gstCertUrl} onChange={(e) => setForm((s) => ({ ...s, gstCertUrl: e.target.value }))} placeholder="GST Certificate URL" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
                <input value={form.panCardUrl} onChange={(e) => setForm((s) => ({ ...s, panCardUrl: e.target.value }))} placeholder="PAN Card URL" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
                <input value={form.bankProofUrl} onChange={(e) => setForm((s) => ({ ...s, bankProofUrl: e.target.value }))} placeholder="Bank Proof URL" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
                <button disabled={submitting} className="sm:col-span-2 rounded bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">{submitting ? "Submitting..." : "Submit Verification"}</button>
              </form>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}

