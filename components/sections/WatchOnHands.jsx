"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { watchOnHands } from "@/data/watchOnHands";
import { getMotionVariants } from "@/lib/motion";

function InlinePhoto({ src, alt }) {
  return (
    <span className="mx-1 inline-grid size-7 shrink-0 overflow-hidden rounded-full border border-border align-middle sm:size-8">
      <Image src={src} alt={alt} width={32} height={32} className="size-full object-cover" />
    </span>
  );
}

export default function WatchOnHands() {
  const prefersReducedMotion = useReducedMotion();
  const variants = getMotionVariants(Boolean(prefersReducedMotion));

  return (
    <section className="overflow-hidden bg-background py-18 text-text md:py-24" aria-labelledby="watch-on-hands-title">
      <Container>
        <header className="relative">
          <h2 id="watch-on-hands-title" className="font-heading text-[clamp(2.5rem,9vw,7.5rem)] font-medium leading-[1.02] tracking-[-0.055em]">
            <span className="block">Watch on</span>
            <span className="block text-right">your hands!</span>
          </h2>
          <Button as={Link} href={watchOnHands.actionHref} variant="outline" size="md" arrow className="mt-5 md:absolute md:right-0 md:top-0 md:mt-0">
            {watchOnHands.action}
          </Button>
          <p className="mt-5 max-w-xs text-caption italic leading-relaxed text-muted md:absolute md:left-0 md:top-[48%] md:mt-0">
            {watchOnHands.description}
          </p>
        </header>

        <div className="relative mt-10 min-h-[420px] overflow-hidden rounded-image bg-surface sm:min-h-[500px] md:mt-14 md:min-h-[600px]">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 opacity-30 md:grid-cols-5" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => {
              const src = watchOnHands.backdropImages[index % watchOnHands.backdropImages.length];
              return (
                <div key={`${src}-${index}`} className="relative overflow-hidden rounded-card">
                  <Image src={src} alt="" fill sizes="(max-width: 767px) 33vw, 20vw" className="object-cover" />
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 bg-background/70" aria-hidden="true" />

          <p className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 whitespace-nowrap text-center font-heading text-[clamp(4rem,19vw,17rem)] font-semibold leading-none tracking-[-0.065em] text-accent/45" aria-hidden="true">
            {watchOnHands.brand}
          </p>

          <div className="absolute left-1/2 top-1/2 z-20 w-[92%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-image border border-border md:w-[72%]">
            <div className="relative aspect-[4/3] md:aspect-[16/10]">
              <Image
                src={watchOnHands.image}
                alt={watchOnHands.imageAlt}
                fill
                sizes="(max-width: 767px) 92vw, 72vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <motion.p
          className="mx-auto mt-10 max-w-4xl text-center font-heading text-[clamp(1.1rem,2.5vw,1.75rem)] leading-relaxed md:mt-14"
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {watchOnHands.lines.map((line, lineIndex) => (
            <motion.span key={lineIndex} className="block" variants={variants.fadeUp}>
              {line.map((part, partIndex) => part.image ? (
                <InlinePhoto key={`${lineIndex}-${partIndex}`} src={part.image} alt={part.alt} />
              ) : (
                <span key={`${lineIndex}-${partIndex}`}>{part.text} </span>
              ))}
            </motion.span>
          ))}
        </motion.p>
      </Container>
    </section>
  );
}
