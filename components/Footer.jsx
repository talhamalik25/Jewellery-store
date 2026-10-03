"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <footer className="bg-stone-900 text-stone-200">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-10">
      <div><Link href="/" className="font-serif text-xl tracking-[0.12em]">ATELIER <span className="text-[#c3a878]">&</span> CO.</Link><p className="mt-4 max-w-xs text-sm leading-6 text-stone-400">Considered pieces, made to be treasured for years to come.</p></div>
      <div><h2 className="text-xs uppercase tracking-[0.2em]">Explore</h2><div className="mt-4 flex gap-5 text-sm text-stone-400"><Link href="/shop">Shop all</Link><Link href="/#story">Our story</Link><Link href="/cart">Your bag</Link></div></div>
      <p className="self-end text-xs text-stone-500 md:text-right">© 2026 Atelier & Co. Made with care.</p>
    </div>
  </footer>;
}
