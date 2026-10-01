"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";

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

  return <div className={`${compact ? "mt-4" : "mt-8"} flex flex-wrap items-center gap-4`}>
    {!compact && <div className="flex h-12 items-center border border-stone-300">
      <button className="h-full w-11" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
      <span className="w-7 text-center text-sm" aria-live="polite">{quantity}</span>
      <button className="h-full w-11" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>+</button>
    </div>}
    <Button type="button" disabled={product.stock === 0 || adding} onClick={handleAdd} className={compact ? "w-full px-4" : ""}>{product.stock === 0 ? "Sold out" : adding ? "Adding…" : added ? "Added to Cart" : "Add to Cart"}</Button>
    {added && <span role="status" className="w-full text-sm text-stone-600">Added to your cart.</span>}
    {error && <p role="alert" className="w-full text-sm text-red-700">{error}{needsLogin && <> <Link href="/login" className="underline underline-offset-4">Sign in</Link></>}</p>}
  </div>;
}
