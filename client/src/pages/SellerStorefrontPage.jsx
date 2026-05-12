import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import VerifiedBadge from "../components/VerifiedBadge";
import TrustScoreBadge from "../components/TrustScoreBadge";
import PageTransition from "../components/common/PageTransition";

export default function SellerStorefrontPage() {
  const { sellerId } = useParams();
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setStatus("loading");
      try {
        const { data } = await api.get(`/sellers/${sellerId}/storefront`, { params: { page, limit: 20 } });
        if (!mounted) return;
        setPayload(data);
        setStatus("succeeded");
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load storefront");
        setStatus("failed");
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [sellerId, page]);

  const products = payload?.products || [];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {status === "loading" && <p className="text-zivvo-text-muted">Loading storefront...</p>}
        {status === "failed" && <p className="text-red-300">{error}</p>}
        {status === "succeeded" && payload && (
          <>
            <section className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <img src={payload.seller.avatar || "https://placehold.co/80x80"} alt={payload.seller.name} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <h1 className="text-2xl font-bold">{payload.seller.name}</h1>
                    <div className="mt-1 flex items-center gap-2">
                      {payload.seller.isVerified && <VerifiedBadge size="lg" />}
                      <span className="text-xs text-zivvo-text-muted">Member since {new Date(payload.seller.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <TrustScoreBadge score={payload.seller.trustScore} />
                  <div className="text-right text-sm">
                    <p className="text-zivvo-text-muted">Total Sales</p>
                    <p className="font-bold">₹{Number(payload.stats?.totalSales || 0).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border border-zivvo-dark-raised px-3 py-1 text-sm disabled:opacity-40">Prev</button>
                <span className="text-sm text-zivvo-text-muted">Page {payload.page} / {payload.pages}</span>
                <button disabled={page >= (payload.pages || 1)} onClick={() => setPage((p) => p + 1)} className="rounded border border-zivvo-dark-raised px-3 py-1 text-sm disabled:opacity-40">Next</button>
              </div>
            </section>
          </>
        )}
      </div>
    </PageTransition>
  );
}
