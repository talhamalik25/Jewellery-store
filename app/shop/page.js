"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { categories } from "@/lib/data";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Could not load products.");
        setProducts(data.products || []);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }

    loadProducts();
  }, []);

  const visibleProducts = selected ? products.filter((product) => product.category === selected) : products;

  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20">
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">The collection</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">Shop all pieces</h1>
    <div className="mt-10 flex flex-wrap gap-3 border-b border-stone-200 pb-6 text-xs uppercase tracking-[0.12em]">
      {["All", ...categories.map((category) => category.name)].map((name) => {
        const category = name === "All" ? "" : name;
        return <button key={name} type="button" onClick={() => setSelected(category)} className={`px-3 py-2 ${selected === category ? "bg-stone-900 text-white" : "border border-stone-300 hover:border-stone-900"}`}>{name}</button>;
      })}
    </div>
    {status === "loading" ? <p className="my-7 text-sm text-stone-500">Loading products…</p>
      : status === "error" ? <p role="alert" className="my-7 text-sm text-red-700">We couldn’t load the collection. Please try again later.</p>
        : visibleProducts.length === 0 ? <p className="my-7 text-sm text-stone-500">No products found{selected ? ` in ${selected}` : ""}.</p>
          : <><p className="my-7 text-sm text-stone-500">{visibleProducts.length} pieces{selected ? ` in ${selected}` : ""}</p><ProductGrid products={visibleProducts} /></>}
  </main>;
}
