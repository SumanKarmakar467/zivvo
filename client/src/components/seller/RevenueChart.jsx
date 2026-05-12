import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const periods = ["7d", "30d", "90d", "12m"];

export default function RevenueChart({ chart, period, onPeriodChange }) {
  const data = (chart?.labels || []).map((label, index) => ({
    label,
    revenue: chart?.revenue?.[index] || 0,
    orders: chart?.orders?.[index] || 0
  }));

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {periods.map((p) => (
          <button key={p} type="button" onClick={() => onPeriodChange(p)} className={`rounded-full px-3 py-1 text-xs ${period === p ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zinc-200"}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "#c7b39f", fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: "#c7b39f", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#c7b39f", fontSize: 11 }} />
            <Tooltip formatter={(value, name) => name === "revenue" ? `₹${Number(value).toLocaleString("en-IN")}` : value} />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#7dd3fc" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ef9f27" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
