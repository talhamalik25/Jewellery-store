"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import ProductGrid from "@/components/ProductGrid";

const PAGE_SIZE = 9;

function FilterFields({ filters, setFilters, categories, shapes, onClose }) {
  function update(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-caption font-medium text-text">Category</legend>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 text-body text-muted">
            <input type="radio" name="category" checked={!filters.category} onChange={() => update("category", "")} className="accent-accent-soft" />
            All pieces
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 text-body text-muted">
              <input type="radio" name="category" checked={filters.category === category} onChange={() => update("category", category)} className="accent-accent-soft" />
              {category}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-caption font-medium text-text">Price range</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-caption text-muted">From
            <span className="mt-2 flex min-h-11 items-center rounded-pill border border-border bg-background px-4 focus-within:ring-2 focus-within:ring-accent-soft/50">
              <span aria-hidden="true" className="mr-2">$</span>
              <input aria-label="Minimum price" type="number" min="0" value={filters.minPrice} onChange={(event) => update("minPrice", event.target.value)} className="w-full bg-transparent text-sm text-text outline-none" />
            </span>
          </label>
          <label className="text-caption text-muted">To
            <span className="mt-2 flex min-h-11 items-center rounded-pill border border-border bg-background px-4 focus-within:ring-2 focus-within:ring-accent-soft/50">
              <span aria-hidden="true" className="mr-2">$</span>
              <input aria-label="Maximum price" type="number" min="0" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} className="w-full bg-transparent text-sm text-text outline-none" />
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-caption font-medium text-text">Shape</legend>
        {shapes.length ? (
          <select aria-label="Filter by shape" value={filters.shape} onChange={(event) => update("shape", event.target.value)} className="min-h-11 w-full rounded-pill border border-border bg-background px-4 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/50">
            <option value="">All shapes</option>
            {shapes.map((shape) => <option key={shape} value={shape}>{shape}</option>)}
          </select>
        ) : <p className="text-caption leading-relaxed text-muted">Shape details aren’t available in the current catalogue.</p>}
      </fieldset>

      {onClose && <Button type="button" onClick={onClose} className="w-full lg:hidden">Show pieces</Button>}
    </div>
  );
}

function ShopSkeleton() {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => <div key={index}>
      <Skeleton className="aspect-[4/5] rounded-image" />
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
    </div>)}
  </div>;
}

export default function ShopExperience({ initialCategory = "" }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ category: initialCategory, shape: "", minPrice: "", maxPrice: "", sort: "featured" });
  const prefersReducedMotion = useReducedMotion();

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.products)) {
        throw new Error(data.error || "We couldn’t load the collection.");
      }
      setProducts(data.products);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message || "We couldn’t load the collection. Please try again.");
      setStatus("error");
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadProducts); }, [loadProducts]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(), [products]);
  const shapes = useMemo(() => [...new Set(products.flatMap((product) => Array.isArray(product.shapes) ? product.shapes : product.shape ? [product.shape] : []))].sort(), [products]);
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const price = Number(product.price) || 0;
      const shapeValues = Array.isArray(product.shapes) ? product.shapes : product.shape ? [product.shape] : [];
      return (!filters.category || product.category === filters.category)
        && (!filters.shape || shapeValues.includes(filters.shape))
        && (filters.minPrice === "" || price >= Number(filters.minPrice))
        && (filters.maxPrice === "" || price <= Number(filters.maxPrice));
    });
    if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "newest") result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return result;
  }, [products, filters]);

  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const clearFilters = () => setFilters({ category: "", shape: "", minPrice: "", maxPrice: "", sort: "featured" });
  const setFilterValue = (updater) => {
    setPage(1);
    setFilters(updater);
  };

  return (
    <main className="min-h-[60vh] pb-20 pt-8 md:pb-30 md:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
        <header className="mt-8 border-b border-border pb-9 md:mt-12 md:pb-12">
          <p className="text-caption uppercase tracking-[0.16em] text-muted">The collection</p>
          <h1 className="mt-3 max-w-4xl font-heading text-section font-medium leading-[1.08] tracking-[-0.05em]">Find the piece that feels like you.</h1>
          <p className="mt-5 max-w-2xl text-body text-muted">Considered jewellery for all the days that make a life.</p>
        </header>

        <div className="grid gap-8 pt-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 lg:pt-10">
          <aside className="hidden lg:block" aria-label="Collection filters">
            <div className="sticky top-28 rounded-card border border-border bg-surface p-6">
              <div className="mb-7 flex items-center justify-between">
                <h2 className="font-heading text-sm font-medium">Refine</h2>
                <button type="button" onClick={clearFilters} className="text-caption text-muted underline underline-offset-4 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Clear all</button>
              </div>
              <FilterFields filters={filters} setFilters={setFilterValue} categories={categories} shapes={shapes} />
            </div>
          </aside>

          <section aria-label="Products">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-caption text-muted" aria-live="polite">{status === "success" ? `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}` : "Curated for you"}</p>
              <div className="ml-auto flex items-center gap-3">
                <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border px-5 text-caption lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                  <span aria-hidden="true">☷</span> Filters
                </button>
                <label className="flex items-center gap-2 text-caption text-muted">Sort
                  <select aria-label="Sort products" value={filters.sort} onChange={(event) => setFilterValue((current) => ({ ...current, sort: event.target.value }))} className="min-h-11 rounded-pill border border-border bg-surface px-4 text-caption text-text outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/50">
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name">Name</option>
                  </select>
                </label>
              </div>
            </div>

            {status === "loading" ? <ShopSkeleton /> : null}
            {status === "error" ? <ErrorState title="The collection is taking a moment" description={errorMessage} onRetry={loadProducts} /> : null}
            {status === "success" && !filteredProducts.length ? <EmptyState title="No pieces found" description="Try adjusting your filters to discover more of the collection." action={<Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>} /> : null}
            {status === "success" && filteredProducts.length > 0 && <>
              <motion.div
                key={`${filters.category}-${filters.shape}-${filters.minPrice}-${filters.maxPrice}-${filters.sort}-${currentPage}`}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductGrid products={pageProducts} />
              </motion.div>
              <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} className="mt-12" />
            </>}
          </section>
        </div>
      </Container>

      {mobileFiltersOpen && <div className="fixed inset-0 z-50 flex items-end bg-background/70 backdrop-blur-sm lg:hidden" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileFiltersOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title" className="max-h-[85vh] w-full overflow-y-auto rounded-t-card border border-border bg-surface p-6 pb-8 shadow-2xl">
          <div className="mb-7 flex items-center justify-between">
            <h2 id="mobile-filter-title" className="font-heading text-card-title font-medium">Refine the collection</h2>
            <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="grid size-10 place-items-center rounded-full border border-border text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">×</button>
          </div>
          <FilterFields filters={filters} setFilters={setFilterValue} categories={categories} shapes={shapes} onClose={() => setMobileFiltersOpen(false)} />
          <button type="button" onClick={clearFilters} className="mt-4 w-full rounded-pill py-3 text-caption text-muted underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Clear all filters</button>
        </section>
      </div>}
    </main>
  );
}
