import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RevenueChart from "../../components/seller/RevenueChart";
import TopProductsTable from "../../components/seller/TopProductsTable";
import OrderFunnelChart from "../../components/seller/OrderFunnelChart";
import LowStockAlert from "../../components/seller/LowStockAlert";
import {
  fetchLowStock,
  fetchOrderFunnel,
  fetchOverview,
  fetchRevenueChart,
  fetchTopProducts
} from "../../features/analytics/analyticsSlice";

const metricCard = (label, current, delta, amber = false) => (
  <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
    <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${amber ? "text-amber-300" : "text-[#ef9f27]"}`}>{current}</p>
    {delta !== null && <p className={`text-xs ${delta >= 0 ? "text-green-400" : "text-red-400"}`}>{delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}%</p>}
  </div>
);

export default function SellerDashboardPage() {
  const dispatch = useDispatch();
  const { overview, revenueChart, topProducts, orderFunnel, lowStock, status, error } = useSelector((state) => state.analytics);
  const [period, setPeriod] = useState("30d");
  const [topBy, setTopBy] = useState("revenue");

  useEffect(() => {
    dispatch(fetchOverview());
    dispatch(fetchOrderFunnel());
    dispatch(fetchLowStock());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRevenueChart(period));
  }, [dispatch, period]);

  useEffect(() => {
    dispatch(fetchTopProducts(topBy));
  }, [dispatch, topBy]);

  if (status === "loading" && !overview) {
    return <main className="min-h-screen p-6"><div className="h-40 animate-pulse rounded-xl bg-zinc-800" /></main>;
  }

  if (error && !overview) {
    return (
      <main className="min-h-screen p-6 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <button type="button" onClick={() => dispatch(fetchOverview())} className="mt-3 rounded-md bg-[#ef9f27] px-4 py-2 text-sm font-semibold text-black">Retry</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#19120b] px-4 py-6 text-[#efe0d3] md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCard("Total Revenue (30d)", `₹${Number(overview?.revenue?.current || 0).toLocaleString("en-IN")}`, overview?.revenue?.deltaPct || 0)}
          {metricCard("Total Orders (30d)", Number(overview?.orders?.current || 0), overview?.orders?.deltaPct || 0)}
          {metricCard("Avg Order Value", `₹${Number(overview?.avgOrderValue?.current || 0).toLocaleString("en-IN")}`, overview?.avgOrderValue?.deltaPct || 0)}
          {metricCard("Pending Orders", Number(overview?.pendingOrders || 0), null, (overview?.pendingOrders || 0) > 0)}
        </div>

        <RevenueChart chart={revenueChart} period={period} onPeriodChange={setPeriod} />

        <div className="grid gap-5 lg:grid-cols-2">
          <TopProductsTable by={topBy} onChangeBy={setTopBy} products={topProducts} />
          <OrderFunnelChart funnel={orderFunnel} />
        </div>

        <LowStockAlert products={lowStock} />
      </div>
    </main>
  );
}
