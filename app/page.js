import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import { categories, products } from "@/lib/data";

export default function Home() {
  return <main>
    <section className="relative min-h-[560px] bg-[#ebe7df] md:min-h-[650px]">
      <Image src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=2200&q=90" alt="Gold jewellery arranged in warm natural light" fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 md:min-h-[650px] md:px-10">
        <div className="max-w-xl text-white"><p className="text-xs uppercase tracking-[0.24em]">A quieter kind of statement</p><h1 className="mt-6 font-serif text-5xl leading-[1.08] md:text-7xl">Made to keep.<br />Made to become yours.</h1><p className="mt-6 max-w-sm text-sm leading-6 text-white/85">Thoughtful jewellery for all the days that make a life.</p><Link href="/shop"><Button className="mt-9 bg-white text-stone-900 hover:bg-stone-100">Discover the collection</Button></Link></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
      <div className="mb-9 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Thoughtfully made</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">The pieces you come back to</h2></div><Link href="/shop" className="hidden text-xs uppercase tracking-[0.14em] underline underline-offset-4 sm:block">View all pieces</Link></div>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
    <section className="bg-[#f2f0eb] py-20 md:py-24"><div className="mx-auto max-w-7xl px-5 md:px-10"><div className="mb-9"><p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Find your favourite</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">A piece for every day</h2></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{categories.map((category) => <CategoryCard key={category.name} category={category} />)}</div></div></section>
    <section id="story" className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-28"><div className="relative aspect-[5/4] bg-stone-100"><Image src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85" alt="A closer look at fine gold jewellery" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div><div className="max-w-md"><p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">The Atelier approach</p><h2 className="mt-4 font-serif text-4xl leading-tight">Less, but chosen with care.</h2><p className="mt-5 text-sm leading-7 text-stone-600">We believe the best jewellery earns its place in your everyday. Each piece is designed with intention, made to be worn often, and kept for a long time.</p><Link href="/shop"><Button variant="outline" className="mt-8">Explore the collection</Button></Link></div></section>
  </main>;
}
