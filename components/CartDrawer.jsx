"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice, getProductSlug } from "@/lib/products";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { items, loading, busy, error, errorStatus, loadCart, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  useEffect(() => {
    const openDrawer = () => setOpen(true);
    window.addEventListener("atelier-open-cart", openDrawer);
    return () => window.removeEventListener("atelier-open-cart", openDrawer);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    closeButton.current?.focus();
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <AnimatePresence>
    {open && <div className="fixed inset-0 z-[70] flex justify-end" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <motion.div className="absolute inset-0 bg-background/75 backdrop-blur-sm" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: prefersReducedMotion ? 0.15 : 0.3 }} />
      <motion.aside role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl" initial={{ x: prefersReducedMotion ? 0 : "100%" }} animate={{ x: 0 }} exit={{ x: prefersReducedMotion ? 0 : "100%" }} transition={{ duration: prefersReducedMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}>
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div><p className="text-caption uppercase tracking-[0.16em] text-muted">Your selection</p><h2 id="cart-drawer-title" className="mt-1 font-heading text-card-title font-medium">Your bag <span className="text-muted">({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div>
          <button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label="Close bag" className="grid size-10 place-items-center rounded-full border border-border text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">×</button>
        </header>

        {loading ? <div className="flex flex-1 items-center justify-center text-body text-muted" role="status">Loading your bag…</div>
          : error && items.length === 0 ? <div className="flex flex-1 flex-col justify-center px-6 text-center">
            <p className="font-heading text-card-title">{errorStatus === 401 ? "Your bag awaits" : "Your bag needs a moment"}</p>
            <p className="mt-3 text-body text-muted">{errorStatus === 401 ? "Sign in to see and manage the pieces in your bag." : error}</p>
            {errorStatus === 401 ? <Button as={Link} href={`/login?next=${encodeURIComponent("/cart")}`} onClick={() => setOpen(false)} size="md" className="mt-6">Sign in</Button> : <Button type="button" onClick={loadCart} className="mt-6">Try again</Button>}
          </div>
          : !items.length ? <div className="flex flex-1 items-center px-6"><EmptyState title="Your bag is waiting" description="When you find a piece you love, it will be here." action={<Button as={Link} href="/shop" onClick={() => setOpen(false)}>Explore the collection</Button>} className="w-full" /></div>
            : <>
              <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-6">
                {error && <p role="alert" className="my-4 rounded-chip border border-[#b76b62]/50 bg-[#4b2925]/45 px-4 py-3 text-caption text-[#f0b6ad]">{error}</p>}
                {items.map((item) => {
                  const product = { _id: item.id, name: item.name };
                  return <article key={item.id} className={`grid grid-cols-[88px_1fr] gap-4 py-5 ${busy ? "opacity-60" : ""}`}>
                    <Link href={`/product/${getProductSlug(product)}`} onClick={() => setOpen(false)} className="relative aspect-[4/5] overflow-hidden rounded-chip bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                      <Image src={item.image || "/images/hero/gemstone-ring.webp"} alt={item.name} fill unoptimized sizes="88px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-col">
                      <Link href={`/product/${getProductSlug(product)}`} onClick={() => setOpen(false)} className="font-heading text-caption font-medium leading-relaxed hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">{item.name}</Link>
                      <p className="mt-1 text-caption text-muted">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex h-9 items-center rounded-pill border border-border" aria-label={`${item.name} quantity`}>
                          <button type="button" disabled={busy || item.quantity <= 1} aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-full w-9 rounded-l-pill text-text hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40">−</button>
                          <span className="w-7 text-center text-caption" aria-live="polite">{item.quantity}</span>
                          <button type="button" disabled={busy || item.quantity >= item.stock} aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-full w-9 rounded-r-pill text-text hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40">+</button>
                        </div>
                        <button type="button" disabled={busy} onClick={() => removeItem(item.id)} className="text-caption text-muted underline underline-offset-4 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40">Remove</button>
                      </div>
                    </div>
                  </article>;
                })}
              </div>
              <footer className="border-t border-border px-6 py-5">
                <div className="flex justify-between text-body"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <p className="mt-2 text-caption text-muted">Shipping is arranged at checkout.</p>
                <Button as={Link} href="/cart" onClick={() => setOpen(false)} size="lg" className="mt-5 w-full">View bag</Button>
                <Link href="/checkout" onClick={() => setOpen(false)} className={`mt-3 block rounded-pill py-3 text-center text-caption text-muted underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft ${busy ? "pointer-events-none opacity-50" : ""}`}>Proceed to checkout</Link>
              </footer>
            </>}
      </motion.aside>
    </div>}
  </AnimatePresence>;
}
