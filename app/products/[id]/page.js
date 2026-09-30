import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CartActions from "@/components/CartActions";
import ProductGrid from "@/components/ProductGrid";
import { formatPrice, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">
    <Link href="/shop" className="text-xs uppercase tracking-[0.14em] text-stone-500 hover:text-stone-900">← Back to the collection</Link>
    <section className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
      <div className="relative aspect-[4/5] bg-stone-100"><Image src={product.image} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
      <div className="py-2 md:py-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">{product.category}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
        <p className="mt-5 text-lg">{formatPrice(product.price)}</p>
        <p className="mt-7 max-w-lg text-sm leading-7 text-stone-600">{product.description}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.12em] text-stone-500">{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}</p>
        <CartActions product={product} />
        <div className="mt-10 border-t border-stone-200 pt-6 text-sm leading-6 text-stone-600"><p>Designed for everyday wear.</p><p>Complimentary gift wrapping with every order.</p></div>
      </div>
    </section>
    {relatedProducts.length > 0 && <section className="mt-20 border-t border-stone-200 pt-14"><div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Keep exploring</p><h2 className="mt-3 font-serif text-3xl">You may also love</h2></div><Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs underline underline-offset-4">Shop {product.category.toLowerCase()}</Link></div><ProductGrid products={relatedProducts} /></section>}
  </main>;
}
