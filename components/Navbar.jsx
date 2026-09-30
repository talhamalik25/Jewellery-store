"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  return <header className="border-b border-stone-200 bg-[#faf9f6]">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
      <Link href="/" className="font-serif text-2xl tracking-[0.12em]">ATELIER <span className="text-[#aa8752]">&</span> CO.</Link>
      <nav aria-label="Main navigation" className="flex items-center gap-5 text-[11px] uppercase tracking-[0.15em] sm:gap-9">
        <Link className="hover:text-[#aa8752]" href="/shop">Shop</Link>
        <Link className="hover:text-[#aa8752]" href="/#story">Our story</Link>
        <Link className="hover:text-[#aa8752]" href="/cart">Bag <span aria-label={`${itemCount} items`}>({itemCount})</span></Link>
      </nav>
    </div>
  </header>;
}
