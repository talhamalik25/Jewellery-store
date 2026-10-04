"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "@/components/ui/Card";
import { formatPrice } from "@/lib/products";

function ChartTooltip({ active, payload, label, money = false }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-chip border border-border bg-surface px-3 py-2 shadow-xl">
    <p className="text-caption text-muted">{label}</p>
    <p className="mt-1 text-caption text-text">{money ? formatPrice(payload[0].value) : `${payload[0].value} orders`}</p>
  </div>;
}

export function OrderValueChart({ data }) {
  const hasData = data.some((day) => day.value > 0);
  return <Card className="p-5 md:p-6">
    <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-caption font-medium">Order value</h2><p className="mt-1 text-caption text-muted">Last 7 days · payments aren’t tracked</p></div><span className="rounded-pill border border-border bg-surface-alt px-3 py-1 text-[10px] text-muted">USD</span></div>
    <div className="mt-6 h-56" aria-label="Order value chart for the last 7 days">
      {hasData ? <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="rgba(243,236,228,0.08)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#a89888", fontSize: 11 }} dy={8} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a89888", fontSize: 10 }} width={42} tickFormatter={(value) => `$${value}`} />
          <Tooltip content={<ChartTooltip money />} cursor={{ stroke: "rgba(243,236,228,0.18)" }} />
          <Line type="monotone" dataKey="value" stroke="#a98468" strokeWidth={2.5} dot={{ fill: "#a98468", stroke: "#241c17", strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: "#f3ece4" }} />
        </LineChart>
      </ResponsiveContainer> : <div className="grid h-full place-items-center text-center text-caption text-muted">No order value recorded in this period.</div>}
    </div>
  </Card>;
}

export function OrderStatusChart({ orders }) {
  const data = useMemo(() => orders.map((order) => ({
    status: (order.status || "pending")[0].toUpperCase() + (order.status || "pending").slice(1),
    count: order.count,
  })), [orders]);
  const max = Math.max(1, ...data.map((item) => item.count));

  return <Card className="p-5 md:p-6">
    <h2 className="font-heading text-caption font-medium">Orders by status</h2>
    <p className="mt-1 text-caption text-muted">Current order pipeline</p>
    {data.length ? <ul className="mt-7 space-y-4">{data.map((item) => <li key={item.status}>
      <div className="mb-2 flex justify-between gap-3 text-caption"><span className="text-muted">{item.status}</span><span>{item.count}</span></div>
      <div className="h-2 overflow-hidden rounded-pill bg-surface-alt"><div className="h-full rounded-pill bg-accent-soft transition-[width] duration-500" style={{ width: `${Math.max(5, item.count / max * 100)}%` }} /></div>
    </li>)}</ul> : <div className="grid min-h-44 place-items-center text-caption text-muted">No orders recorded yet.</div>}
  </Card>;
}
