"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { formatPrice } from "@/lib/data";

function formatOrderDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString();
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", { credentials: "same-origin" });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error(data.error || "Unable to load your orders.");
        if (!Array.isArray(data.orders)) throw new Error("The orders response was invalid.");
        if (active) setOrders(data.orders);
      } catch (requestError) {
        if (active) setError(requestError.message || "Unable to load your orders. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => { active = false; };
  }, [router]);

  if (loading) {
    return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 text-sm text-stone-500 md:px-10 md:py-20" role="status">Loading your orders…</main>;
  }

  if (error) {
    return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20"><h1 className="font-serif text-4xl">Your orders</h1><p role="alert" className="mt-6 text-sm text-red-700">{error}</p><Link href="/shop" className="mt-5 inline-block text-sm underline underline-offset-4">Continue shopping</Link></main>;
  }

  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20">
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Atelier &amp; Co.</p>
    <h1 className="mt-3 font-serif text-4xl md:text-5xl">Your orders</h1>

    {orders.length === 0 ? <div className="mt-10 border-y border-stone-200 py-14 text-center"><p className="font-serif text-2xl">No orders yet</p><p className="mt-3 text-sm text-stone-500">Your placed orders will appear here.</p><Link href="/shop"><Button className="mt-7">Explore the collection</Button></Link></div>
      : <div className="mt-10 space-y-6">
        {orders.map((order) => <article key={order._id} className="border border-stone-200 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-5">
            <div><p className="text-xs uppercase tracking-[0.12em] text-stone-500">Order</p><p className="mt-2 break-all text-sm">{order._id}</p><p className="mt-2 text-xs text-stone-500">{formatOrderDate(order.createdAt)}</p></div>
            <span className="border border-stone-300 px-3 py-2 text-xs capitalize">{order.status || "pending"}</span>
          </div>

          <div className="grid gap-8 py-6 md:grid-cols-[1fr_280px]">
            <section>
              <h2 className="font-serif text-xl">Items</h2>
              <div className="mt-3 divide-y divide-stone-200">
                {(order.items || []).map((item, index) => <div key={`${item.product || item.name}-${index}`} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><div><p>{item.name}</p><p className="mt-1 text-xs text-stone-500">Quantity: {item.quantity} · {formatPrice(Number(item.price) || 0)} each</p></div><span>{formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 0))}</span></div>)}
              </div>
              <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 font-medium"><span>Total</span><span>{formatPrice(Number(order.total) || 0)}</span></div>
            </section>

            <section>
              <h2 className="font-serif text-xl">Shipping address</h2>
              <address className="mt-3 space-y-1 text-sm not-italic text-stone-600">
                <p>{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}</p>
              </address>
            </section>
          </div>
        </article>)}
      </div>}
  </main>;
}
