"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import { ctaContent, newsletterContent } from "@/data/cta";
import { getMotionVariants } from "@/lib/motion";

export default function CtaNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const prefersReducedMotion = useReducedMotion();
  const variants = getMotionVariants(Boolean(prefersReducedMotion));

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatus({ type: "error", message: "Enter your email address." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      setStatus({ type: "error", message: "Enter a valid email address, such as name@example.com." });
      return;
    }

    setStatus({ type: "success", message: "Thanks! Your email address looks good." });
    setEmail("");
  };

  return (
    <section className="bg-background py-18 text-text md:py-24" aria-label="Design CTA and newsletter">
      <Container>
        <motion.div
          className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-image border border-border px-5 py-14 text-center sm:min-h-[420px] md:min-h-[480px] md:px-12"
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Image
            src={ctaContent.image}
            alt=""
            fill
            sizes="(max-width: 1279px) calc(100vw - 48px), 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/70" aria-hidden="true" />
          <div className="relative z-10 max-w-4xl">
            <h2 className="font-heading text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-tight tracking-[-0.04em]">
              {ctaContent.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
            </h2>
            <Button as={Link} href={ctaContent.actionHref} variant="outline" size="md" className="mt-10 min-w-56">
              {ctaContent.action}
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2 md:items-end md:gap-x-12 md:gap-y-8">
          <motion.h2
            className="font-heading text-[clamp(2.1rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.055em] md:col-span-2"
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {newsletterContent.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
          </motion.h2>

          <form className="grid gap-6 md:col-span-2 md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-12" noValidate onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={newsletterContent.placeholder}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status.type !== "idle") setStatus({ type: "idle", message: "" });
                }}
                required
                showSubmit
                submitLabel={newsletterContent.submitLabel}
                aria-invalid={status.type === "error"}
                aria-describedby="newsletter-feedback"
              />
              <p
                id="newsletter-feedback"
                className={"mt-3 min-h-5 text-caption " + (status.type === "idle" ? "text-muted" : "text-text")}
                role={status.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {status.message}
              </p>
            </div>
            <p className="max-w-md text-body italic leading-relaxed text-muted md:pt-1">
              {newsletterContent.description}
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
