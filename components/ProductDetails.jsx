"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartActions from "@/components/CartActions";
import { formatPrice } from "@/lib/data";

export default function ProductDetails({ id }) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(id)}`);
        const data = await response.json();
        if (response.status === 404) {
          setStatus("not-found");
          return;
        }
        if (!response.ok) throw new Error(data.error || "Could not load product.");
        setProduct(data);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    }

    loadProduct();
  }, [id]);

  if (status === "loading") return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10">Loading product…</main>;
  if (status === "not-found") return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10"><h1 className="font-serif text-3xl">Product not found</h1><Link href="/shop" className="mt-4 inline-block text-sm underline">Back to the collection</Link></main>;
  if (status === "error") return <main role="alert" className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 text-sm text-red-700 md:px-10">We couldn’t load this product. Please try again later.</main>;

  return <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">
    <Link href="/shop" className="text-xs uppercase tracking-[0.14em] text-stone-500 hover:text-stone-900">← Back to the collection</Link>
    <section className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
      <div className="relative aspect-[4/5] bg-stone-100"><Image src={product.image} alt={product.name} fill unoptimized priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
      <div className="py-2 md:py-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">{product.category}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
        <p className="mt-5 text-lg">{formatPrice(product.price)}</p>
        <p className="mt-7 max-w-lg text-sm leading-7 text-stone-600">{product.description}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.12em] text-stone-500">{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}</p>
        <CartActions product={product} />
      </div>
    </section>
  </main>;
}
