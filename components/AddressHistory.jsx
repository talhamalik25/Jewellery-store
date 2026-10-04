"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";

function AddressSkeleton() {
  return <div className="mt-8 grid gap-4 sm:grid-cols-2">{[0, 1].map((index) => <Card key={index} className="space-y-3 p-6"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/3" /></Card>)}</div>;
}

export default function AddressHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/orders", { credentials: "same-origin", cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        router.replace(`/login?next=${encodeURIComponent("/account/addresses")}`);
        return;
      }
      if (!response.ok || !Array.isArray(data.orders)) throw new Error(data.error || "We couldn’t load your address history.");
      setOrders(data.orders);
      setStatus("success");
    } catch (requestError) {
      setError(requestError.message || "We couldn’t load your address history.");
      setStatus("error");
    }
  }, [router]);

  useEffect(() => { void Promise.resolve().then(loadOrders); }, [loadOrders]);

  const addresses = useMemo(() => {
    const unique = new Map();
    orders.forEach((order) => {
      const address = order.shippingAddress;
      if (!address) return;
      const key = [address.fullName, address.phone, address.address, address.city].join("|").toLowerCase();
      if (!unique.has(key)) unique.set(key, { ...address, lastOrderId: order._id });
    });
    return [...unique.values()];
  }, [orders]);

  return <main className="min-h-[60vh] py-8 md:py-12">
    <Breadcrumbs items={[{ label: "Account", href: "/account/profile" }, { label: "Addresses" }]} />
    <p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Your account</p>
    <h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Addresses</h1>
    <p className="mt-4 max-w-prose text-body text-muted">Addresses used for previous orders.</p>
    <p className="mt-2 max-w-prose text-caption leading-relaxed text-muted">The account API doesn’t save a reusable address book. These details are read from your order history.</p>
    {status === "loading" && <AddressSkeleton />}
    {status === "error" && <ErrorState title="Your address history needs a moment" description={error} onRetry={loadOrders} className="mt-8" />}
    {status === "success" && addresses.length === 0 && <EmptyState title="No addresses yet" description="A delivery address will appear here after your first order." action={<Button as={Link} href="/shop">Explore the collection</Button>} className="mt-8" />}
    {status === "success" && addresses.length > 0 && <div className="mt-8 grid gap-4 sm:grid-cols-2">{addresses.map((address) => <Card key={`${address.lastOrderId}-${address.address}`} className="p-6">
      <p className="font-heading text-caption font-medium">{address.fullName}</p>
      <address className="mt-4 space-y-1 text-body not-italic text-muted"><p>{address.phone}</p><p>{address.address}</p><p>{address.city}</p></address>
      <Link href={`/orders/${address.lastOrderId}`} className="mt-5 inline-block text-caption text-muted underline underline-offset-4 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">View related order</Link>
    </Card>)}</div>}
  </main>;
}
