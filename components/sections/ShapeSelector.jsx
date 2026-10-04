"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { shapeIllustrations } from "@/components/icons/shapes";
import { products } from "@/data/products";
import { shapes } from "@/data/shapes";

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function ShapeSelector() {
  const [selectedShapeId, setSelectedShapeId] = useState("round");
  const [favorites, setFavorites] = useState([]);
  const tileRefs = useRef([]);
  const prefersReducedMotion = useReducedMotion();
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId) || shapes[0];
  const ShapeIllustration = shapeIllustrations[selectedShape.id];
  const shapeProducts = products.filter((product) => product.shapeId === selectedShape.id);
  const selectedIndex = shapes.findIndex((shape) => shape.id === selectedShapeId);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    tileRefs.current[selectedIndex]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex, prefersReducedMotion]);

  const selectAndFocus = (index) => {
    const nextIndex = (index + shapes.length) % shapes.length;
    setSelectedShapeId(shapes[nextIndex].id);
    tileRefs.current[nextIndex]?.focus();
  };

  const handleTileKeyDown = (event, index) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectAndFocus(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectAndFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectAndFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectAndFocus(shapes.length - 1);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  return (
    <section id="shape-explorer" className="overflow-hidden bg-background py-18 text-text md:py-24" aria-labelledby="shape-selector-title">
      <Container>
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <h2 id="shape-selector-title" className="font-heading text-section font-medium leading-tight tracking-[-0.045em]">Shop Diamond by Shape</h2>
            <p className="mt-3 text-body text-muted">Find the cut that fits your story.</p>
          </div>
          <Button as={Link} href="#shape-options" variant="outline" size="sm" className="w-fit">View all shapes</Button>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={selectedShape.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transition}
            className="mb-8 grid overflow-hidden rounded-image border border-border bg-surface lg:mb-10 lg:min-h-[520px] lg:grid-cols-2"
            aria-live="polite"
          >
            <div className="relative grid min-h-72 place-items-center overflow-hidden p-8 sm:min-h-80 lg:min-h-full">
              <span className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl sm:size-96" aria-hidden="true" />
              <ShapeIllustration className="relative z-10 size-64 max-w-full text-text sm:size-80 lg:size-96" shimmer={!prefersReducedMotion} />
            </div>

            <div className="flex flex-col justify-center px-6 pb-8 sm:px-10 sm:pb-10 lg:px-14 lg:py-14">
              <p className="mb-3 text-caption uppercase tracking-[0.18em] text-muted">Cut profile</p>
              <h3 className="font-heading text-[clamp(2.5rem,5vw,5rem)] font-medium leading-none tracking-[-0.05em]">{selectedShape.name}</h3>
              <p className="mt-4 text-body leading-relaxed text-muted">{selectedShape.tagline}</p>

              <dl className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="min-w-0 rounded-card border border-border bg-background px-3 py-3 sm:px-4">
                  <dt className="text-caption text-muted">Brilliance</dt>
                  <dd className="mt-1 text-caption font-medium text-text">{selectedShape.brilliance}</dd>
                </div>
                <div className="min-w-0 rounded-card border border-border bg-background px-3 py-3 sm:px-4">
                  <dt className="text-caption text-muted">Best for</dt>
                  <dd className="mt-1 text-caption font-medium text-text">{selectedShape.bestFor}</dd>
                </div>
                <div className="min-w-0 rounded-card border border-border bg-background px-3 py-3 sm:px-4">
                  <dt className="text-caption text-muted">From</dt>
                  <dd className="mt-1 text-caption font-medium text-text">${selectedShape.fromPrice.toLocaleString("en-US")}</dd>
                </div>
              </dl>

              <Button as={Link} href={`/shop?shape=${selectedShape.id}`} variant="primary" size="md" arrow className="mt-7 w-fit">
                Shop {selectedShape.name} diamonds
              </Button>
            </div>
          </motion.article>
        </AnimatePresence>

        <div
          id="shape-options"
          role="radiogroup"
          aria-label="Choose a diamond shape"
          className="-mx-4 mb-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 lg:mb-12 lg:grid-cols-8 lg:gap-3"
        >
          {shapes.map((shape, index) => {
            const ShapeIcon = shapeIllustrations[shape.id];
            const active = shape.id === selectedShapeId;
            return (
              <button
                key={shape.id}
                ref={(node) => { tileRefs.current[index] = node; }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelectedShapeId(shape.id)}
                onKeyDown={(event) => handleTileKeyDown(event, index)}
                className={(active ? "scale-[1.03] bg-accent text-text " : "bg-surface text-muted hover:bg-surface-alt ") + "group flex min-h-28 min-w-28 snap-center flex-col items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-center transition duration-300 ease-editorial focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2 md:min-w-0"}
              >
                <ShapeIcon className="size-10 transition-transform duration-300 ease-editorial group-hover:rotate-3" />
                <span className="font-heading text-caption font-medium">{shape.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-5 flex items-end justify-between gap-4">
          <h3 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight">{selectedShape.name} diamonds</h3>
          <p className="shrink-0 text-caption text-muted">{selectedShape.pieceCount} pieces</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedShape.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transition}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4"
          >
            {shapeProducts.map((product, index) => {
              const favorite = favorites.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: cardVariants.hidden,
                    visible: { ...cardVariants.visible, transition: { ...transition, delay: index * 0.06 } },
                  }}
                  initial="hidden"
                  animate="visible"
                  className="w-[min(62vw,18rem)] shrink-0 snap-start md:w-auto"
                >
                  <Card interactive className="group h-full overflow-hidden rounded-card bg-surface">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 639px) 62vw, (max-width: 1023px) 45vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        aria-label={`${favorite ? "Remove" : "Add"} ${product.name} ${favorite ? "from" : "to"} favorites`}
                        aria-pressed={favorite}
                        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-xl leading-none text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2"
                      >
                        {favorite ? "♥" : "♡"}
                      </button>
                    </div>
                    <div className="flex items-start justify-between gap-3 p-4">
                      <h4 className="font-heading text-caption font-medium leading-relaxed">{product.name}</h4>
                      <p className="shrink-0 text-caption text-muted">${product.price.toLocaleString("en-US")}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
