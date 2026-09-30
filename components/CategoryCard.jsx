import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return <Link href={`/shop?category=${encodeURIComponent(category.name)}`} className="group relative block aspect-[4/5] overflow-hidden bg-stone-200">
    <Image src={category.image} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
    <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
    <div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="font-serif text-2xl">{category.name}</p><p className="mt-1 text-xs tracking-wide text-white/85">{category.count}</p></div>
  </Link>;
}
