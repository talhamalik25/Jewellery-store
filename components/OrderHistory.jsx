"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { formatPrice } from "@/lib/products";

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];
const statusLabels = { pending: "Order placed", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
}

function OrderSkeleton() {
  return <div className="mt-8 space-y-4" role="status">{[0, 1].map((index) => <Card key={index} className="space-y-4 p-6"><Skeleton className="h-5 w-44" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-12 w-full" /></Card>)}</div>;
}

function StatusTimeline({ status, placedAt }) {
  const normalized = statusSteps.includes(status) ? status : "pending";
  const currentIndex = statusSteps.indexOf(normalized);
  return <ol className="mt-6 space-y-0" aria-label="Order status timeline">
    {status === "cancelled" && <li className="mb-4 rounded-chip border border-[#b76b62]/50 bg-[#4b2925]/45 px-4 py-3 text-caption text-[#f0b6ad]">This order was cancelled.</li>}
    {statusSteps.map((step, index) => {
      const complete = status !== "cancelled" && index <= currentIndex;
      const active = status !== "cancelled" && index === currentIndex;
      return <li key={step} className="relative flex min-h-14 gap-4">
        <span className="relative flex w-5 shrink-0 justify-center">
          <span className={`relative z-10 mt-1 grid size-5 place-items-center rounded-full border text-[10px] ${complete ? "border-accent-soft bg-accent text-text" : "border-border bg-surface text-muted"}`}>{complete ? "✓" : ""}</span>
          {index < statusSteps.length - 1 && <span aria-hidden="true" className={`absolute top-5 h-full w-px ${complete && index < currentIndex ? "bg-accent-soft" : "bg-border"}`} />}
        </span>
        <span className={`pb-5 text-caption ${active ? "font-medium text-text" : complete ? "text-muted" : "text-muted/70"}`}>{statusLabels[step]}{active && <span className="ml-2 text-muted">Current</span>}</span>
      </li>;
    })}
    <li className="mt-1 text-caption text-muted">Placed {formatDate(placedAt)}</li>
  </ol>;
}

function OrderCard({ order }) {
  return <Card as="article" className="p-5 md:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
      <div className="min-w-0"><p className="text-caption uppercase tracking-[0.12em] text-muted">Order · {formatDate(order.createdAt)}</p><p className="mt-2 break-all font-mono text-caption text-muted">{order._id}</p></div>
      <Badge tone="accent" className="capitalize">{order.status || "pending"}</Badge>
    </div>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-caption text-muted">{order.items?.length || 0} {order.items?.length === 1 ? "piece" : "pieces"}</p><p className="mt-1 font-heading text-body font-medium">{formatPrice(order.total)}</p></div>
      <Button as={Link} href={`/orders/${order._id}`} variant="outline" size="sm">View details</Button>
    </div>
  </Card>;
}

function OrderDetail({ order }) {
  const status = order.status || "pending";
  return <>
    <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-caption uppercase tracking-[0.14em] text-muted">Order placed {formatDate(order.createdAt)}</p><h1 className="mt-3 break-all font-heading text-card-title font-medium">Order details</h1><p className="mt-2 break-all font-mono text-caption text-muted">{order._id}</p></div>
      <Badge tone="accent" className="capitalize">{status}</Badge>
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-6">
        <Card className="p-5 md:p-7">
          <h2 className="font-heading text-card-title font-medium">Items</h2>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {(order.items || []).map((item, index) => <div key={`${item.product || item.name}-${index}`} className="flex flex-wrap justify-between gap-3 py-4 text-body">
              <div><p>{item.name}</p><p className="mt-1 text-caption text-muted">Quantity {item.quantity} · {formatPrice(item.price)} each</p></div><p className="shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>)}
          </div>
          <div className="mt-5 flex justify-between text-body font-medium"><span>Subtotal</span><span>{formatPrice(order.total)}</span></div>
          <p className="mt-3 text-caption text-muted">Shipping and payment arrangements are confirmed separately.</p>
        </Card>
        <Card className="p-5 md:p-7">
          <h2 className="font-heading text-card-title font-medium">Delivery address</h2>
          <address className="mt-4 space-y-1 text-body not-italic text-muted"><p>{order.shippingAddress?.fullName}</p><p>{order.shippingAddress?.phone}</p><p>{order.shippingAddress?.address}</p><p>{order.shippingAddress?.city}</p></address>
        </Card>
      </div>
      <Card className="h-fit p-5 md:p-7"><h2 className="font-heading text-card-title font-medium">Order progress</h2><StatusTimeline status={status} placedAt={order.createdAt} /><p className="mt-4 text-caption text-muted">The order service provides the current status only; status change dates aren’t available.</p></Card>
    </div>
  </>;
}

export default function OrderHistory({ orderId = "" }) {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const detailHref = orderId ? `/orders/${encodeURIComponent(orderId)}` : "/orders";

  const loadOrders = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/orders", { credentials: "same-origin", cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        router.replace(`/login?next=${encodeURIComponent(detailHref)}`);
        return;
      }
      if (!response.ok || !Array.isArray(data.orders)) throw new Error(data.error || "We couldn’t load your orders.");
      setOrders(data.orders);
      setStatus("success");
    } catch (requestError) {
      setError(requestError.message || "We couldn’t load your orders. Please try again.");
      setStatus("error");
    }
  }, [detailHref, router]);

  useEffect(() => { void Promise.resolve().then(loadOrders); }, [loadOrders]);

  const order = useMemo(() => orders.find((item) => item._id === orderId) || null, [orders, orderId]);
  if (status === "loading") return <><p className="mt-8 text-caption uppercase tracking-[0.14em] text-muted">Atelier &amp; Co.</p><h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">{orderId ? "Order details" : "Your orders"}</h1><OrderSkeleton /></>;
  if (status === "error") return <><h1 className="font-heading text-section font-medium tracking-[-0.05em]">{orderId ? "Order details" : "Your orders"}</h1><ErrorState title="Your orders need a moment" description={error} onRetry={loadOrders} className="mt-8" /></>;

  if (orderId) {
    if (!order) return <><Breadcrumbs items={[{ label: "Account", href: "/account/profile" }, { label: "Your orders", href: "/orders" }, { label: "Order details" }]} /><EmptyState title="Order not found" description="We couldn’t find that order in your account." action={<Button as={Link} href="/orders">Back to your orders</Button>} className="mt-8" /></>;
    return <><Breadcrumbs items={[{ label: "Account", href: "/account/profile" }, { label: "Your orders", href: "/orders" }, { label: "Order details" }]} /><OrderDetail order={order} /></>;
  }

  return <>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your orders" }]} />
    <p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Atelier &amp; Co.</p>
    <h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Your orders</h1>
    {orders.length ? <div className="mt-8 space-y-4">{orders.map((item) => <OrderCard key={item._id} order={item} />)}</div>
      : <EmptyState title="No orders yet" description="Your order history will appear here once you place your first order." action={<Button as={Link} href="/shop">Explore the collection</Button>} className="mt-8" />}
  </>;
}
