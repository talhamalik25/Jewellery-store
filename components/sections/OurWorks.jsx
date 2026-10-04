"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import IconButton from "@/components/ui/IconButton";
import { works } from "@/data/works";
import { getMotionVariants } from "@/lib/motion";

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      {direction === "left" ? (
        <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export default function OurWorks() {
  const [activeIndex, setActiveIndex] = useState(2);
  const scrollRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const variants = getMotionVariants(Boolean(prefersReducedMotion));
  const orderedWorks = works.map((_, index) => works[(activeIndex + index - 2 + works.length) % works.length]);

  useEffect(() => {
    const row = scrollRef.current;
    const featuredCard = row?.children[2];
    if (!row || !featuredCard || window.matchMedia("(min-width: 64rem)").matches) return;

    row.scrollTo({
      left: featuredCard.offsetLeft - row.offsetLeft - (row.clientWidth - featuredCard.clientWidth) / 2,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, prefersReducedMotion]);

  const move = (direction) => {
    setActiveIndex((index) => (index + direction + works.length) % works.length);
  };

  return (
    <section className="overflow-hidden bg-background py-18 text-text md:py-24" aria-labelledby="our-works-title">
      <Container>
        <motion.div
          className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-start md:gap-8"
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p className="max-w-56 pt-2 text-caption italic leading-relaxed text-muted md:shrink-0" variants={variants.fadeUp}>
            Explore our signature pieces, thoughtfully made to bring a little more character to every day.
          </motion.p>
          <motion.h2 id="our-works-title" className="font-heading text-[clamp(3rem,9vw,7rem)] font-medium leading-none tracking-[-0.055em] md:ml-auto" variants={variants.fadeUp}>
            OUR WORKS
          </motion.h2>
        </motion.div>

        <div
          ref={scrollRef}
          className="-mx-4 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[0.86fr_0.96fr_1.2fr_0.96fr_0.86fr] lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-10"
          aria-label="Featured jewelry work"
        >
          {orderedWorks.map((work, index) => {
            const featured = index === 2;
            return (
              <motion.div
                key={work.id}
                layout
                className={(featured ? "w-[min(78vw,22rem)] lg:w-auto " : "w-[min(68vw,19rem)] lg:w-auto ") + "shrink-0 snap-center"}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card interactive className={(featured ? "lg:scale-105 " : "") + "group relative aspect-[4/7] overflow-hidden rounded-image border-border bg-surface shadow-none"}>
                  <Image
                    src={work.image}
                    alt={work.imageAlt}
                    fill
                    sizes="(max-width: 639px) 78vw, (max-width: 1023px) 68vw, 24vw"
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-background/60 px-4 pb-4 pt-10 md:px-5 md:pb-5" aria-hidden="true" />
                  {featured && (
                    <span className="absolute left-4 top-4 rounded-pill bg-background/60 px-3 py-1 text-caption text-text md:left-5 md:top-5">
                      {work.category}
                    </span>
                  )}
                  <h3 className="absolute inset-x-4 bottom-4 font-heading text-sm font-medium leading-snug text-text md:inset-x-5 md:bottom-5 md:text-base">
                    {work.title}
                  </h3>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2">
          <IconButton label="Previous work" icon={<Arrow direction="left" />} onClick={() => move(-1)} />
          <IconButton label="Next work" icon={<Arrow direction="right" />} onClick={() => move(1)} className="border-text" />
        </div>
      </Container>
    </section>
  );
}
