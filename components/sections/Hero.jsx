"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { heroContent } from "@/data/hero";
import { getMotionVariants } from "@/lib/motion";

function GemMark() {
  return (
    <span className="grid size-16 shrink-0 place-items-center rounded-full border border-border bg-gradient-to-br from-accent-soft via-accent to-surface-alt text-3xl text-text md:size-20" role="img" aria-label="Gemstone illustration">
      <span aria-hidden="true">✧</span>
    </span>
  );
}

export default function Hero() {
  const variants = getMotionVariants(Boolean(useReducedMotion()));

  return (
    <section className="relative isolate overflow-hidden bg-background pb-8 text-text md:pb-12" aria-labelledby="home-hero-title">
      <Container className="relative">
        <div className="relative isolate flex min-h-[78svh] items-end overflow-hidden rounded-image bg-gradient-to-br from-surface via-background to-surface-alt max-md:min-h-[78svh] md:min-h-[min(78svh,800px)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_30%,color-mix(in_srgb,var(--color-accent-soft)_36%,transparent),transparent_48%),linear-gradient(110deg,var(--color-surface),var(--color-background)_58%,var(--color-surface-alt))]"
            role="img"
            aria-label="Replaceable dark jewelry campaign image placeholder"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/10 to-background/40" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" aria-hidden="true" />

          <motion.div
            className="relative z-10 w-full max-w-5xl px-4 pb-16 pt-24 md:px-10 md:pb-24 lg:px-12"
            variants={variants.stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p className="mb-4 max-w-lg text-caption italic leading-relaxed text-text" variants={variants.fadeUp}>
              {heroContent.intro}
            </motion.p>
            <motion.h1 id="home-hero-title" className="max-w-5xl font-heading text-hero font-medium leading-tight tracking-[-0.045em]" variants={variants.fadeUp}>
              <span>{heroContent.titleLines[0]}</span>
              <br className="max-md:hidden" />
              {" "}<span>{heroContent.titleLines[1]}</span>
            </motion.h1>
            <motion.div className="mt-8 flex flex-wrap gap-2" variants={variants.fadeUp}>
              {heroContent.actions.map((action) => (
                <Button key={action.label} as={Link} href={action.href} variant={action.variant} size="md">
                  {action.label}
                </Button>
              ))}
            </motion.div>
          </motion.div>

          <div className="absolute right-4 top-1/3 z-10 flex flex-col items-center gap-3 text-caption text-text md:right-8" role="group" aria-label={"Slide " + heroContent.slides.current + " of " + heroContent.slides.total}>
            <span>{heroContent.slides.current}</span>
            <span className="h-16 w-px bg-text" aria-hidden="true" />
            <span>{heroContent.slides.total}</span>
          </div>

          <div className="absolute bottom-6 right-4 z-10 flex gap-2 md:bottom-8 md:right-8" aria-hidden="true">
            <span className="grid size-9 place-items-center rounded-full border border-border text-text md:size-12">←</span>
            <span className="grid size-9 place-items-center rounded-full border border-border text-text md:size-12">→</span>
          </div>
        </div>

        <motion.div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3" variants={variants.stagger} initial="hidden" animate="visible">
          {heroContent.cards.map((card) => (
            <motion.div key={card.id} className="min-w-0" variants={variants.fadeUp}>
              <Card className={"flex h-full min-h-24 items-center gap-4 p-4 " + (card.kind === "design" ? "bg-surface-alt" : card.kind === "rating" ? "bg-accent" : "")}>
                {card.kind === "gemstone" && <GemMark />}
                <div className="min-w-0">
                  <p className={"mb-2 text-caption leading-snug " + (card.kind === "rating" ? "text-text" : "text-muted")}>{card.eyebrow}</p>
                  <h2 className={card.kind === "rating" ? "font-heading text-2xl font-semibold leading-tight md:text-3xl" : "font-heading text-card-title font-medium leading-snug"}>
                    {card.title}
                  </h2>
                  {card.action && (
                    <Button as={Link} href="/shop" variant="ghost" size="sm" arrow className="mt-2 !px-0">
                      {card.action}
                    </Button>
                  )}
                  {card.detail && <span className="mt-1 block text-caption text-text">{card.detail}</span>}
                </div>
                {card.kind === "rating" && (
                  <span className="ml-auto flex shrink-0 pl-2" aria-hidden="true">
                    <i className="size-8 rounded-full border border-text bg-gradient-to-br from-surface-alt to-muted" />
                    <i className="-ml-2 size-8 rounded-full border border-text bg-gradient-to-br from-surface-alt to-muted" />
                    <i className="-ml-2 size-8 rounded-full border border-text bg-gradient-to-br from-surface-alt to-muted" />
                  </span>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
