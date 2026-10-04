import Image from "next/image";
import Link from "next/link";
import CartActions from "@/components/CartActions";
import WishlistButton from "@/components/WishlistButton";
import { getProductSlug, formatPrice } from "@/lib/products";

export default function ProductCard({ product }) {
  const href = product?._id ? `/product/${getProductSlug(product)}` : "/shop";
  const image = product?.image || "/images/hero/gemstone-ring.webp";

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-image border border-border bg-surface">
        <Link href={href} className="relative block aspect-[4/5] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft" aria-label={`View ${product.name}`}>
          <Image src={image} alt={product.name ? `${product.name} jewellery` : "Jewellery piece"} fill unoptimized sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]" />
        </Link>
        <div className="absolute right-3 top-3">
          <WishlistButton product={product} compact />
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pt-4">
        <div className="min-w-0">
          <Link href={href} className="font-heading text-caption font-medium leading-snug hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">{product.name}</Link>
          <p className="mt-1.5 text-caption text-muted">{product.category}</p>
        </div>
        <p className="shrink-0 text-caption text-text">{formatPrice(product.price)}</p>
      </div>
      <CartActions product={product} compact />
    </article>
  );
}
