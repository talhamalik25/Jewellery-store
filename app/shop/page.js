import ProductGrid from "@/components/ProductGrid";
import { categories, products } from "@/lib/data";
import Link from "next/link";

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const selected = params?.category;
  const visibleProducts = selected ? products.filter((product) => product.category === selected) : products;
  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20">
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">The collection</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">Shop all pieces</h1>
    <div className="mt-10 flex flex-wrap gap-3 border-b border-stone-200 pb-6 text-xs uppercase tracking-[0.12em]">{["All", ...categories.map((category) => category.name)].map((name) => <Link key={name} href={name === "All" ? "/shop" : `/shop?category=${encodeURIComponent(name)}`} className={`px-3 py-2 ${(!selected && name === "All") || selected === name ? "bg-stone-900 text-white" : "border border-stone-300 hover:border-stone-900"}`}>{name}</Link>)}</div>
    <p className="my-7 text-sm text-stone-500">{visibleProducts.length} pieces{selected ? ` in ${selected}` : ""}</p><ProductGrid products={visibleProducts} />
  </main>;
}
