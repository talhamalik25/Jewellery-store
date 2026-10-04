"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import CartActions from "@/components/CartActions";
import ProductGrid from "@/components/ProductGrid";
import WishlistButton from "@/components/WishlistButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import { formatPrice, getProductSlug } from "@/lib/products";

function ProductSkeleton() {
  return <Container className="py-10 md:py-16">
    <Skeleton className="h-4 w-36" />
    <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
      <Skeleton className="aspect-[4/5] rounded-image" />
      <div className="space-y-5 py-4 md:py-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-52 rounded-pill" />
      </div>
    </div>
  </Container>;
}

export default function ProductDetails({ slug }) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const loadProduct = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.products)) {
        throw new Error(data.error || "We couldn’t load this piece.");
      }
      const found = data.products.find((item) => getProductSlug(item) === slug);
      setProducts(data.products);
      setProduct(found || null);
      setActiveImage(0);
      setStatus(found ? "success" : "not-found");
    } catch (error) {
      setErrorMessage(error.message || "We couldn’t load this piece. Please try again.");
      setStatus("error");
    }
  }, [slug]);

  useEffect(() => { void Promise.resolve().then(loadProduct); }, [loadProduct]);

  const images = useMemo(() => {
    if (!product) return [];
    const gallery = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const allImages = [product.image, ...gallery].filter(Boolean);
    return [...new Set(allImages.length ? allImages : ["/images/hero/gemstone-ring.webp"])];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item._id !== product._id && item.category === product.category).slice(0, 4);
  }, [product, products]);

  if (status === "loading") return <main className="min-h-[60vh]"><ProductSkeleton /></main>;
  if (status === "error") return <main className="min-h-[60vh] py-14"><Container><ErrorState title="This piece is taking a moment" description={errorMessage} onRetry={loadProduct} /></Container></main>;
  if (status === "not-found" || !product) return <main className="min-h-[60vh] py-14 md:py-20"><Container><EmptyState title="We couldn’t find that piece" description="It may have moved on to a new home. Explore the collection to find another favourite." action={<Link href="/shop" className="inline-flex min-h-11 items-center justify-center rounded-pill bg-text px-6 text-caption font-medium text-background transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Explore the collection</Link>} /></Container></main>;

  const image = images[activeImage] || images[0];

  return (
    <main className="pb-20 pt-8 md:pb-30 md:pt-12">
      <Container>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` }, { label: product.name }]} />
        <section className="mt-7 grid items-start gap-8 md:mt-10 md:grid-cols-2 md:gap-12 lg:gap-20" aria-label={product.name}>
          <motion.div initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-image border border-border bg-surface">
              <Image src={image} alt={`${product.name}${activeImage ? `, view ${activeImage + 1}` : ""}`} fill unoptimized priority={activeImage === 0} sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              <div className="absolute right-4 top-4"><WishlistButton product={product} /></div>
            </div>
            {images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3" aria-label="Product images">
              {images.map((galleryImage, index) => <button key={`${galleryImage}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={activeImage === index} className={`relative aspect-square overflow-hidden rounded-chip border focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft ${activeImage === index ? "border-accent-soft" : "border-border opacity-65 hover:opacity-100"}`}>
                <Image src={galleryImage} alt="" fill unoptimized sizes="100px" className="object-cover" />
              </button>)}
            </div>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0.2 : 0.55, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }} className="pt-1 md:sticky md:top-28 md:py-5">
            <p className="text-caption uppercase tracking-[0.16em] text-muted">{product.category}</p>
            <h1 className="mt-4 font-heading text-hero font-medium leading-[1.1] tracking-[-0.05em]">{product.name}</h1>
            <p className="mt-5 text-xl text-text">{formatPrice(product.price)}</p>
            <div className="my-7 h-px bg-border" />
            <p className="max-w-prose whitespace-pre-line text-body leading-relaxed text-muted">{product.description}</p>
            <p className="mt-6 text-caption text-muted" aria-live="polite">{product.stock > 0 ? "In stock — ready to be yours" : "Currently out of stock"}</p>
            <CartActions product={product} />
            <p className="mt-4 text-caption text-muted">Save this piece to a wishlist stored on this device.</p>
            {product.shape && <p className="mt-6 text-caption text-muted">Shape <span className="ml-2 text-text">{product.shape}</span></p>}
            {product.metal && <p className="mt-2 text-caption text-muted">Metal <span className="ml-2 text-text">{product.metal}</span></p>}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && <p className="mt-2 text-caption text-muted">Available sizes <span className="ml-2 text-text">{product.sizes.join(", ")}</span></p>}
          </motion.div>
        </section>

        <section className="mt-20 border-t border-border pt-12 md:mt-30 md:pt-16" aria-labelledby="related-products-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.16em] text-muted">Made to go together</p>
              <h2 id="related-products-heading" className="mt-3 font-heading text-card-title font-medium">More from {product.category}</h2>
            </div>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="text-caption text-muted underline decoration-border underline-offset-4 transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">View the collection</Link>
          </div>
          {relatedProducts.length ? <ProductGrid products={relatedProducts} /> : <p className="rounded-card border border-border bg-surface px-6 py-8 text-body text-muted">More pieces from this collection are on their way.</p>}
        </section>
      </Container>
    </main>
  );
}
