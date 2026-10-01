"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/data";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOrders = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/orders", { credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.orders)) throw new Error(data.error || "Unable to load orders.");
      setOrders(data.orders);
    } catch (requestError) {
      setError(requestError.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  async function updateStatus(orderId, status) {
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ orderId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update order.");
      setOrders((current) => current.map((order) => order._id === orderId ? data.order : order));
      setNotice(`Order status updated to ${status}.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to update order.");
      await loadOrders();
    }
  }

  return <main>
    <div><h2 className="font-serif text-3xl">Orders</h2><p className="mt-2 text-sm text-stone-600">Review purchases and update fulfilment status.</p></div>
    {error && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-5 border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
    {loading ? <p className="mt-6 text-sm text-stone-500" role="status">Loading orders…</p>
      : orders.length === 0 ? <p className="mt-6 border-y border-stone-200 py-10 text-sm text-stone-500">There are no orders yet.</p>
        : <div className="mt-6 space-y-4">{orders.map((order) => <article key={order._id} className="border border-stone-200 bg-white p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4">
            <div><p className="text-[10px] uppercase tracking-[0.14em] text-stone-500">Order ID</p><p className="mt-1 break-all text-sm">{order._id}</p><p className="mt-2 text-xs text-stone-500">{formatDate(order.createdAt)}</p></div>
            <label className="text-xs uppercase tracking-[0.1em] text-stone-600">Status<select aria-label={`Status for order ${order._id}`} value={order.status || "pending"} onChange={(event) => updateStatus(order._id, event.target.value)} className="ml-3 min-h-10 border border-stone-300 bg-white px-3 text-sm normal-case tracking-normal text-stone-900">{statuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></label>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_250px]">
            <section><h3 className="font-serif text-xl">Items</h3><div className="mt-2 divide-y divide-stone-100">{(order.items || []).map((item, index) => <div key={`${item.product || item.name}-${index}`} className="flex justify-between gap-4 py-2 text-sm"><span>{item.name} <span className="text-xs text-stone-500">× {item.quantity}</span></span><span>{formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 0))}</span></div>)}</div><div className="mt-3 flex justify-between border-t border-stone-200 pt-3 text-sm font-medium"><span>Total</span><span>{formatPrice(Number(order.total) || 0)}</span></div></section>
            <section><h3 className="font-serif text-xl">Customer</h3><p className="mt-2 text-sm">{order.shippingAddress?.fullName || order.user?.name || "Customer"}</p>{order.user?.email && <p className="mt-1 break-all text-xs text-stone-500">{order.user.email}</p>}<address className="mt-3 space-y-1 text-xs not-italic text-stone-500"><p>{order.shippingAddress?.phone}</p><p>{order.shippingAddress?.address}</p><p>{order.shippingAddress?.city}</p></address></section>
          </div>
        </article>)}</div>}
  </main>;
}
