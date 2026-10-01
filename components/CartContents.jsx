"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/data";

export default function CartContents() {
  const { items, loading, busy, error, loadCart, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return <p className="mt-12 py-14 text-center text-sm text-stone-500" role="status">Loading your bag…</p>;
  }

  if (error && items.length === 0) {
    return <div className="mt-12 border-y border-stone-200 py-14 text-center">
      <p className="text-sm text-red-700" role="alert">{error}</p>
      <Button type="button" className="mt-7" onClick={loadCart}>Try again</Button>
    </div>;
  }

  if (items.length === 0) {
    return <div className="mt-12 border-y border-stone-200 py-14 text-center"><p className="font-serif text-2xl">Your bag is waiting</p><p className="mt-3 text-sm text-stone-500">When you find a piece you love, it will be here.</p><Link href="/shop"><Button className="mt-7">Explore the collection</Button></Link></div>;
  }

  return <div className="mt-10">
    {error && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert"><span>{error}</span><button type="button" onClick={loadCart} className="underline underline-offset-4">Reload bag</button></div>}
    <Link href="/checkout" aria-disabled={busy} className={`mb-8 inline-flex min-h-12 w-full items-center justify-center bg-stone-900 px-7 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-stone-700 sm:w-auto ${busy ? "pointer-events-none opacity-45" : ""}`}>Proceed to Checkout</Link>
    <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
      <div className="divide-y divide-stone-200 border-y border-stone-200">
        {items.map((item) => <article key={item.id} className={`grid grid-cols-[100px_1fr] gap-5 py-6 sm:grid-cols-[140px_1fr_auto] ${busy ? "opacity-70" : ""}`}>
          <Link href={`/products/${item.id}`} className="relative aspect-[4/5] bg-stone-100">
            {item.image && <Image src={item.image} alt={item.name} fill unoptimized sizes="140px" className="object-cover" />}
          </Link>
          <div className="flex flex-col items-start py-1"><p className="text-xs uppercase tracking-[0.12em] text-stone-500">{item.category}</p><Link href={`/products/${item.id}`} className="mt-2 font-serif text-xl">{item.name}</Link><p className="mt-2 text-sm">{formatPrice(item.price)}</p><button type="button" disabled={busy} onClick={() => removeItem(item.id)} className="mt-auto pt-5 text-xs text-stone-500 underline underline-offset-4 hover:text-stone-900 disabled:cursor-not-allowed">Remove</button></div>
          <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:gap-5 sm:py-1"><div className="flex h-10 items-center border border-stone-300"><button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={busy || item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-full w-9 disabled:opacity-40">−</button><span className="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} disabled={busy || item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-full w-9 disabled:opacity-40">+</button></div><p className="text-sm">{formatPrice(item.price * item.quantity)}</p></div>
        </article>)}
      </div>
      <aside className="h-fit border border-stone-200 p-6"><h2 className="font-serif text-2xl">Order summary</h2><div className="mt-7 flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="mt-4 flex justify-between text-sm text-stone-500"><span>Shipping</span><span>Calculated at checkout</span></div><div className="mt-5 flex justify-between border-t border-stone-200 pt-5 font-medium"><span>Total</span><span>{formatPrice(subtotal)}</span></div></aside>
    </div>
  </div>;
}
