"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/products";

export default function CheckoutSuccess({ orderId }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      if (!orderId) {
        setStatus("missing");
        return;
      }
      try {
        const response = await fetch("/api/orders", { credentials: "same-origin", cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(`/checkout/success?orderId=${orderId}`)}`);
          return;
        }
        if (!response.ok) throw new Error(data.error || "We couldn’t retrieve the order confirmation.");
        const found = Array.isArray(data.orders) ? data.orders.find((item) => item._id === orderId) : null;
        setOrder(found || null);
        setStatus(found ? "success" : "missing");
      } catch (requestError) {
        setError(requestError.message || "We couldn’t retrieve the order confirmation.");
        setStatus("error");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [orderId, router, retryCount]);

  if (status === "loading") return <div className="mx-auto max-w-2xl space-y-5 py-16" role="status"><Skeleton className="mx-auto size-16 rounded-full" /><Skeleton className="mx-auto h-10 w-72" /><Skeleton className="h-44 w-full rounded-card" /></div>;
  if (status === "error") return <ErrorState title="Your order was submitted" description={error} onRetry={() => setRetryCount((current) => current + 1)} />;
  if (status === "missing") return <div className="py-12 text-center"><h1 className="font-heading text-card-title">We couldn’t find that order</h1><p className="mt-3 text-body text-muted">Check your order history or return to your bag.</p><div className="mt-6 flex justify-center gap-3"><Button as={Link} href="/orders" variant="outline">Your orders</Button><Button as={Link} href="/cart">Your bag</Button></div></div>;

  return <div className="mx-auto max-w-2xl py-8 md:py-12">
    <div className="mx-auto grid size-14 place-items-center rounded-full border border-accent-soft/50 bg-accent/20 text-xl text-text" aria-hidden="true">✓</div>
    <p className="mt-6 text-center text-caption uppercase tracking-[0.16em] text-muted">Order received</p>
    <h1 className="mt-3 text-center font-heading text-section font-medium tracking-[-0.05em]">Thank you, {order.shippingAddress?.fullName?.split(" ")[0] || ""}.</h1>
    <p className="mx-auto mt-4 max-w-prose text-center text-body text-muted">Your order request is in. The store will confirm delivery and payment arrangements with you separately.</p>

    <Card className="mt-9 p-6 md:p-8">
      <div className="flex flex-wrap justify-between gap-3 border-b border-border pb-4 text-caption"><span className="text-muted">Order reference</span><span className="break-all">{order._id}</span></div>
      <div className="mt-5 space-y-3">
        {(order.items || []).map((item, index) => <div key={`${item.product || item.name}-${index}`} className="flex justify-between gap-4 text-caption"><span>{item.name} <span className="text-muted">× {item.quantity}</span></span><span className="shrink-0">{formatPrice(item.price * item.quantity)}</span></div>)}
      </div>
      <div className="mt-5 flex justify-between border-t border-border pt-5 text-body font-medium"><span>Subtotal</span><span>{formatPrice(order.total)}</span></div>
      <p className="mt-4 text-caption leading-relaxed text-muted">No payment was processed online. Shipping costs and payment arrangements are not included.</p>
    </Card>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Button as={Link} href={`/orders/${order._id}`} variant="outline">View order details</Button><Button as={Link} href="/shop">Continue shopping</Button></div>
  </div>;
}
