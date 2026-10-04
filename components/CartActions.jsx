"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { getProductSlug } from "@/lib/products";

export default function CartActions({ product, compact = false }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  async function handleAdd() {
    setAdding(true);
    setError("");
    setNeedsLogin(false);
    const result = await addItem(product, quantity);
    setAdding(false);
    setAdded(result.success);
    if (!result.success) {
      setNeedsLogin(result.status === 401);
      setError(result.message || "We couldn’t add this piece. Please try again.");
    }
  }

  return <div className={`${compact ? "mt-3" : "mt-8"} flex flex-wrap items-center gap-4`}>
    {!compact && <div className="flex h-12 items-center rounded-pill border border-border bg-surface">
      <button type="button" className="h-full w-11 rounded-l-pill text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
      <span className="w-7 text-center text-sm" aria-live="polite">{quantity}</span>
      <button type="button" disabled={quantity >= product.stock} className="h-full w-11 rounded-r-pill text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>+</button>
    </div>}
    <Button type="button" size="lg" disabled={product.stock === 0 || adding} onClick={handleAdd} className={compact ? "w-full px-4" : "min-w-52"}>{product.stock === 0 ? "Sold out" : adding ? "Adding to bag…" : added ? "Added to bag" : "Add to bag"}</Button>
    {added && <span role="status" className="w-full text-caption text-muted">Added to your bag.</span>}
    {error && <p role="alert" className="w-full text-caption text-[#f0b6ad]">{error}{needsLogin && <> <Link href={`/login?next=${encodeURIComponent(`/product/${getProductSlug(product)}`)}`} className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Sign in</Link></>}</p>}
  </div>;
}
