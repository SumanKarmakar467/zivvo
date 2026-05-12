import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

const palette = ["#ef9f27", "#60a5fa", "#34d399", "#a78bfa", "#f472b6", "#f87171"];
const order = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
const labelMap = {
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export default function OrderFunnelChart({ funnel }) {
  const source = new Map((funnel || []).map((item) => [item.status, item.count]));
  const data = order.map((status) => ({ status: labelMap[status], count: source.get(status) || 0, fill: palette[order.indexOf(status) % palette.length] }));

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" stroke="#c7b39f" />
            <YAxis type="category" dataKey="status" width={95} stroke="#c7b39f" />
            <Bar dataKey="count">
              <LabelList dataKey="count" position="right" fill="#efe0d3" />
              {data.map((entry) => <Cell key={entry.status} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
