"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/components/CartProvider";

export default function CartActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  return <div className="mt-8 flex flex-wrap items-center gap-4">
    <div className="flex h-12 items-center border border-stone-300">
      <button className="h-full w-11" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
      <span className="w-7 text-center text-sm" aria-live="polite">{quantity}</span>
      <button className="h-full w-11" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}>+</button>
    </div>
    <Button disabled={product.stock === 0} onClick={() => { addItem(product, quantity); setAdded(true); }}>{product.stock === 0 ? "Sold out" : added ? "Added to bag" : "Add to bag"}</Button>
    {added && <span role="status" className="w-full text-sm text-stone-600">Added to your bag.</span>}
  </div>;
}
