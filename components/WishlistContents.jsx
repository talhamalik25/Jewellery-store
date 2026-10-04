"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import ProductGrid from "@/components/ProductGrid";

const STORAGE_KEY = "atelier-wishlist";

function readWishlistSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function WishlistSkeleton() {
  return <div className="grid grid-cols-2 gap-4 pt-8 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item}><Skeleton className="aspect-[4/5] rounded-image" /><Skeleton className="mt-4 h-4 w-2/3" /><Skeleton className="mt-2 h-3 w-1/3" /></div>)}</div>;
}

export default function WishlistContents() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const getSnapshot = useCallback(() => readWishlistSnapshot(), []);
  const subscribe = useCallback((onChange) => {
    window.addEventListener("storage", onChange);
    window.addEventListener("atelier-wishlist-change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("atelier-wishlist-change", onChange);
    };
  }, []);
  const idsJson = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const ids = useMemo(() => {
    try {
      const value = JSON.parse(idsJson);
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }, [idsJson]);

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.products)) throw new Error(data.error || "We couldn’t load your saved pieces.");
      setProducts(data.products);
      setStatus("success");
    } catch (requestError) {
      setError(requestError.message || "We couldn’t load your saved pieces.");
      setStatus("error");
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadProducts); }, [loadProducts]);

  const savedProducts = useMemo(() => products.filter((product) => ids.includes(String(product._id))), [products, ids]);

  return <main className="min-h-[60vh] py-8 md:py-12">
    <Container>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Your keepsakes</p>
      <h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Saved for later.</h1>
      <p className="mt-4 max-w-prose text-body text-muted">Your wishlist is saved on this device and isn’t synced to an account.</p>
      {status === "loading" && <WishlistSkeleton />}
      {status === "error" && <ErrorState title="Your saved pieces need a moment" description={error} onRetry={loadProducts} className="mt-8" />}
      {status === "success" && !savedProducts.length && <EmptyState title={ids.length ? "Some saved pieces have moved on" : "Your wishlist is quiet for now"} description={ids.length ? "These pieces are no longer in the current collection." : "Save a piece from the collection and it will be waiting here."} action={<Button as={Link} href="/shop">Explore the collection</Button>} className="mt-8" />}
      {status === "success" && savedProducts.length > 0 && <div className="pt-8"><ProductGrid products={savedProducts} /></div>}
    </Container>
  </main>;
}
