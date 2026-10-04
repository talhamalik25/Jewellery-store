"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { newCollection } from "@/data/collection";
import { getMotionVariants } from "@/lib/motion";

function CollectionImage() {
  const imageRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden bg-surface md:aspect-auto md:min-h-[480px]">
      <motion.div
        className="absolute -inset-y-5 inset-x-0"
        style={{ y: prefersReducedMotion ? 0 : parallaxY }}
      >
        <Image
          src={newCollection.image}
          alt={newCollection.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 55vw, 704px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}

export default function NewCollection() {
  const prefersReducedMotion = useReducedMotion();
  const variants = getMotionVariants(Boolean(prefersReducedMotion));

  return (
    <section className="bg-background py-18 text-text md:py-24" aria-label="New Collection">
      <Container>
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeading
            title="NEW COLLECTION"
            className="mb-8 justify-end text-right max-md:items-end max-md:text-right md:mb-12"
          />
        </motion.div>

        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="grid overflow-hidden rounded-image bg-surface md:grid-cols-[1.1fr_0.9fr]">
            <CollectionImage />

            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-14">
              <p className="mb-4 text-caption uppercase tracking-[0.18em] text-muted">{newCollection.eyebrow}</p>
              <h3 className="font-heading text-[clamp(1.75rem,3.4vw,3.25rem)] font-medium leading-tight tracking-[-0.04em]">
                Introducing {newCollection.title}
              </h3>
              <p className="mt-5 max-w-xl text-body leading-relaxed text-muted">{newCollection.description}</p>

              <ul className="mt-7 space-y-4">
                {newCollection.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-body">
                    <span className="size-2 shrink-0 rounded-full bg-accent-soft" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button as={Link} href="/shop" variant="outline" size="md" arrow className="mt-8 w-fit">
                {newCollection.action}
              </Button>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
