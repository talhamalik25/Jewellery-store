import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DashboardRetry from "@/components/admin/DashboardRetry";
import { OrderStatusChart, OrderValueChart } from "@/components/admin/DashboardCharts";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { formatPrice } from "@/lib/products";

export const metadata = {
  title: "Admin Overview | Atelier & Co.",
  description: "Store overview and recent activity for Atelier & Co.",
  robots: { index: false, follow: false },
};

function serialiseOrder(order) {
  return {
    id: String(order._id),
    createdAt: order.createdAt?.toISOString?.() || null,
    status: order.status || "pending",
    total: Number(order.total) || 0,
    customerName: order.user?.name || order.shippingAddress?.fullName || "Customer",
    customerEmail: order.user?.email || "",
    itemsCount: (order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
  };
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function statusTone(status) {
  return status === "cancelled" ? "neutral" : ["confirmed", "shipped", "delivered"].includes(status) ? "accent" : "neutral";
}

async function getDashboardData() {
  await connectDB();
  const [orderCount, customerCount, productCount, allOrders, recentOrders, statusCounts, valueTotals] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Order.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }).select("total createdAt status").lean(),
    Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(8).lean(),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return { key: localDateKey(date), label: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date), value: 0 };
  });
  const byDay = new Map(days.map((day) => [day.key, day]));
  allOrders.forEach((order) => {
    const day = byDay.get(localDateKey(new Date(order.createdAt)));
    if (day && order.status !== "cancelled") day.value += Number(order.total) || 0;
  });
  const grossOrderValue = Number(valueTotals[0]?.total) || 0;

  return {
    stats: { grossOrderValue, orderCount, customerCount, productCount },
    orderValueByDay: days,
    recentOrders: recentOrders.map(serialiseOrder),
    orderStatuses: statusCounts.map((item) => ({ status: item._id || "pending", count: item.count })),
  };
}

function DashboardSkeleton() {
  return <div className="animate-pulse space-y-5 motion-reduce:animate-none" aria-label="Loading dashboard">
    <div className="h-24 rounded-card bg-surface-alt" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-card bg-surface-alt" />)}</div>
    <div className="grid gap-5 xl:grid-cols-2"><div className="h-80 rounded-card bg-surface-alt" /><div className="h-80 rounded-card bg-surface-alt" /></div>
  </div>;
}

export default async function AdminDashboardPage() {
  let data;
  try {
    data = await getDashboardData();
  } catch (error) {
    console.error("Failed to load admin dashboard:", error);
    return <main><h1 className="font-heading text-card-title font-medium">Dashboard overview</h1><p className="mt-2 text-body text-muted">Store performance and recent activity.</p><DashboardRetry message="We couldn’t retrieve the latest store data. Try again in a moment." /></main>;
  }

  const metrics = [
    { label: "Gross order value", value: formatPrice(data.stats.grossOrderValue), note: "Non-cancelled orders · payment untracked" },
    { label: "Orders", value: data.stats.orderCount.toLocaleString(), note: "All order statuses" },
    { label: "Customers", value: data.stats.customerCount.toLocaleString(), note: "Registered customer accounts" },
    { label: "Products", value: data.stats.productCount.toLocaleString(), note: "Catalogue items" },
  ];

  return <main className="space-y-5">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-caption uppercase tracking-[0.16em] text-muted">Store performance</p><h1 className="mt-2 font-heading text-card-title font-medium">Dashboard overview</h1><p className="mt-2 text-caption text-muted">A current view of orders and the catalogue.</p></div>
      <p className="text-caption text-muted">Updated {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date())}</p>
    </header>

    <section aria-label="Store statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => <Card key={metric.label} className="p-5">
        <div className="flex items-center justify-between gap-2"><p className="text-caption text-muted">{metric.label}</p><span className="grid size-8 place-items-center rounded-full border border-border bg-surface-alt text-caption text-accent-soft" aria-hidden="true">{["↗", "≡", "○", "◇"][index]}</span></div>
        <p className="mt-4 font-heading text-card-title font-medium tracking-tight">{metric.value}</p>
        <p className="mt-2 text-[10px] leading-relaxed text-muted">{metric.note}</p>
      </Card>)}
    </section>

    <section aria-label="Store charts" className="grid gap-5 xl:grid-cols-2">
      <OrderValueChart data={data.orderValueByDay} />
      <OrderStatusChart orders={data.orderStatuses} />
    </section>

    <section aria-labelledby="recent-orders-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div><h2 id="recent-orders-heading" className="font-heading text-caption font-medium">Recent orders</h2><p className="mt-1 text-caption text-muted">The latest order activity</p></div>
        <Link href="/admin/orders" className="text-caption text-muted underline underline-offset-4 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">View all orders</Link>
      </div>
      {data.recentOrders.length ? <Table>
        <TableHead><tr><TableHeaderCell>Order</TableHeaderCell><TableHeaderCell>Customer</TableHeaderCell><TableHeaderCell>Date</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell className="text-right">Order value</TableHeaderCell></tr></TableHead>
        <TableBody>{data.recentOrders.map((order) => <TableRow key={order.id}>
          <TableCell><Link href="/admin/orders" className="font-mono text-caption text-text underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">#{order.id.slice(-8).toUpperCase()}</Link><p className="mt-1 text-[10px] text-muted">{order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}</p></TableCell>
          <TableCell><p className="text-caption text-text">{order.customerName}</p>{order.customerEmail && <p className="mt-1 text-[10px] text-muted">{order.customerEmail}</p>}</TableCell>
          <TableCell className="whitespace-nowrap text-caption text-muted">{formatDate(order.createdAt)}</TableCell>
          <TableCell><Badge tone={statusTone(order.status)} className="capitalize">{order.status}</Badge></TableCell>
          <TableCell className="whitespace-nowrap text-right text-caption">{formatPrice(order.total)}</TableCell>
        </TableRow>)}</TableBody>
      </Table> : <Card className="px-6 py-10 text-center"><h3 className="font-heading text-caption font-medium">No orders yet</h3><p className="mt-2 text-caption text-muted">New orders will appear here.</p></Card>}
    </section>

    <div className="flex flex-wrap gap-2 border-t border-border pt-4 text-caption">
      <Link href="/admin/products" className="rounded-pill border border-border px-4 py-2 text-muted transition hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Manage products</Link>
      <Link href="/admin/orders" className="rounded-pill border border-border px-4 py-2 text-muted transition hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Review orders</Link>
    </div>
  </main>;
}
