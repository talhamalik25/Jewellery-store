"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import { formatPrice, getProductSlug } from "@/lib/products";

function CartSkeleton() {
  return <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
    <div className="space-y-5">{[0, 1].map((row) => <div key={row} className="flex gap-5 rounded-card border border-border bg-surface p-5"><Skeleton className="h-32 w-24 rounded-chip" /><div className="flex-1 space-y-3"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /><Skeleton className="mt-8 h-9 w-28 rounded-pill" /></div></div>)}</div>
    <Skeleton className="h-60 rounded-card" />
  </div>;
}

export default function CartContents() {
  const { items, loading, busy, error, errorStatus, loadCart, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) return <CartSkeleton />;
  if (error && items.length === 0) {
    if (errorStatus === 401) return <EmptyState title="Sign in to see your bag" description="Your bag is saved to your account. Sign in to view your pieces and continue." action={<Button as={Link} href={`/login?next=${encodeURIComponent("/cart")}`}>Sign in</Button>} className="mt-10" />;
    return <ErrorState title="Your bag needs a moment" description={error} onRetry={loadCart} className="mt-10" />;
  }
  if (!items.length) return <EmptyState title="Your bag is waiting" description="When you find a piece you love, it will be here." action={<Button as={Link} href="/shop">Explore the collection</Button>} className="mt-10" />;

  return <div className="mt-10">
    {error && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-chip border border-[#b76b62]/50 bg-[#4b2925]/45 px-4 py-3 text-caption text-[#f0b6ad]" role="alert"><span>{error}</span><button type="button" onClick={loadCart} className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Reload bag</button></div>}
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
      <div className="space-y-4">
        {items.map((item) => {
          const product = { _id: item.id, name: item.name };
          const href = `/product/${getProductSlug(product)}`;
          return <Card as="article" key={item.id} className={`grid grid-cols-[92px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:gap-6 sm:p-5 ${busy ? "opacity-65" : ""}`}>
            <Link href={href} className="relative aspect-[4/5] overflow-hidden rounded-chip bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
              <Image src={item.image || "/images/hero/gemstone-ring.webp"} alt={item.name} fill unoptimized sizes="(max-width: 640px) 92px, 140px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-col py-1">
              <p className="text-caption uppercase tracking-[0.14em] text-muted">{item.category}</p>
              <Link href={href} className="mt-2 font-heading text-caption font-medium leading-relaxed hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">{item.name}</Link>
              <p className="mt-2 text-body">{formatPrice(item.price)}</p>
              <button type="button" disabled={busy} onClick={() => removeItem(item.id)} className="mt-auto self-start pt-4 text-caption text-muted underline underline-offset-4 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40">Remove</button>
            </div>
            <div className="col-span-2 flex items-center justify-between gap-4 border-t border-border pt-4 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:pt-1">
              <div className="flex h-10 items-center rounded-pill border border-border" aria-label={`${item.name} quantity`}>
                <button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={busy || item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-full w-9 rounded-l-pill text-text hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40">−</button>
                <span className="w-8 text-center text-caption" aria-live="polite">{item.quantity}</span>
                <button type="button" aria-label={`Increase ${item.name} quantity`} disabled={busy || item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-full w-9 rounded-r-pill text-text hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40">+</button>
              </div>
              <p className="text-caption font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </Card>;
        })}
      </div>
      <aside className="h-fit lg:sticky lg:top-28">
        <Card className="p-6 md:p-7">
          <h2 className="font-heading text-card-title font-medium">Order summary</h2>
          <div className="mt-7 flex justify-between text-body"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="mt-3 flex justify-between text-caption text-muted"><span>Shipping</span><span>Confirmed separately</span></div>
          <div className="mt-5 flex justify-between border-t border-border pt-5 font-medium"><span>Order subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <Button as={Link} href="/checkout" aria-disabled={busy} onClick={(event) => { if (busy) event.preventDefault(); }} size="lg" className={`mt-6 w-full ${busy ? "pointer-events-none opacity-50" : ""}`}>Continue to checkout</Button>
          <p className="mt-4 text-center text-caption text-muted">Shipping rates and payment methods aren’t configured online.</p>
        </Card>
      </aside>
    </div>
  </div>;
}
