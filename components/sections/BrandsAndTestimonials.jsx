"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import Container from "@/components/ui/Container";
import { brandPlaceholders, testimonials } from "@/data/testimonials";
import { getMotionVariants } from "@/lib/motion";

export default function BrandsAndTestimonials() {
  const swiperRef = useRef(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const variants = getMotionVariants(Boolean(prefersReducedMotion));

  const syncAutoplay = () => {
    if (prefersReducedMotion) return;

    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;

    if (hoveredRef.current || focusedRef.current) autoplay.stop();
    else autoplay.start();
  };

  return (
    <section className="overflow-hidden bg-background py-18 text-text md:py-24" aria-labelledby="customer-experiences-title">
      <Container>
        <div className="mb-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-y border-border py-5 text-muted md:mb-20 md:py-6" role="list" aria-label="Placeholder brand logos">
          {brandPlaceholders.map((brand, index) => (
            <div key={brand} role="listitem" className="flex min-w-[28%] flex-1 items-center justify-center gap-5 text-center md:min-w-0">
              <span className="font-heading text-caption font-medium tracking-[0.16em] opacity-65">{brand}</span>
              {index < brandPlaceholders.length - 1 && <span className="hidden text-accent-soft md:inline" aria-hidden="true">✦</span>}
            </div>
          ))}
        </div>

        <motion.header
          className="relative mb-12 md:mb-16"
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 id="customer-experiences-title" className="font-heading text-[clamp(2.75rem,9.5vw,7.5rem)] font-medium leading-[1.02] tracking-[-0.055em]">
            <span className="block">Customers</span>
            <span className="block text-right">Experiences</span>
          </h2>
          <p className="mt-5 max-w-xs text-caption italic leading-relaxed text-muted md:absolute md:left-0 md:top-[48%] md:mt-0">
            Our regular customers helped us reach the best with their good and useful comments and suggestions.
          </p>
        </motion.header>

        <div
          role="region"
          aria-label="Customer testimonials"
          tabIndex={0}
          onMouseEnter={() => { hoveredRef.current = true; syncAutoplay(); }}
          onMouseLeave={() => { hoveredRef.current = false; syncAutoplay(); }}
          onFocusCapture={() => { focusedRef.current = true; syncAutoplay(); }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              focusedRef.current = false;
              syncAutoplay();
            }
          }}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4"
        >
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            initialSlide={1}
            loop
            speed={650}
            spaceBetween={16}
            autoplay={prefersReducedMotion ? false : { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: false }}
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 60, modifier: 1, slideShadows: false }}
            breakpoints={{
              640: { spaceBetween: 24 },
              1024: { spaceBetween: 32 },
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; syncAutoplay(); }}
            className="!overflow-visible [&_.swiper-slide]:opacity-45 [&_.swiper-slide]:transition-[filter,opacity] [&_.swiper-slide-active]:!opacity-100 [&_.swiper-slide-active]:!blur-0"
            aria-label="Customer experiences carousel"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="!h-auto !w-[min(88vw,34rem)]">
                {({ isActive }) => (
                  <article className={(isActive ? "scale-100 " : "scale-[0.94] ") + "flex min-h-44 items-center gap-4 rounded-pill border border-border bg-surface px-4 py-5 transition-transform duration-500 ease-editorial sm:min-h-52 sm:gap-6 sm:px-6 md:gap-8 md:px-8"}>
                    <Image
                      src={testimonial.avatar}
                      alt={`${testimonial.name}, customer`}
                      width={144}
                      height={144}
                      className="size-24 shrink-0 rounded-full border border-border object-cover sm:size-28 md:size-36"
                    />
                    <div className="min-w-0 pr-2 sm:pr-4">
                      <p className="text-body leading-relaxed text-text">“{testimonial.review}”</p>
                      <p className="mt-4 text-caption italic text-muted">{testimonial.name}</p>
                    </div>
                  </article>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
}
