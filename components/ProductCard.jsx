import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/data";

export default function ProductCard({ product }) {
  const href = product._id ? `/products/${product._id}` : "/shop";

  return <article className="group">
    <Link href={href} className="block overflow-hidden bg-[#f0eee9]">
      <div className="relative aspect-[4/5]">
        <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
    </Link>
    <div className="flex justify-between gap-3 pt-4"><div><p className="text-sm">{product.name}</p><p className="mt-1 text-xs text-stone-500">{product.category}</p></div><p className="shrink-0 text-sm">{formatPrice(product.price)}</p></div>
  </article>;
}
