"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import IconButton from "@/components/ui/IconButton";
import { categories } from "@/data/categories";
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

export default function CategoryCarousel() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const prefersReducedMotion = useReducedMotion();
  const variants = getMotionVariants(Boolean(prefersReducedMotion));
  const activeCategory = categories[activeIndex];
  const previousCategory = categories[(activeIndex - 1 + categories.length) % categories.length];
  const nextCategory = categories[(activeIndex + 1) % categories.length];

  return (
    <section className="overflow-hidden bg-surface pt-12 text-text md:pt-16" aria-labelledby="category-view-title">
      <div className="relative">
          <motion.h2
            id="category-view-title"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 whitespace-nowrap text-center font-heading text-[clamp(3rem,10vw,8.5rem)] font-medium leading-none tracking-[-0.055em]"
            variants={variants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Category View
          </motion.h2>

          <div className="relative z-0 pt-[clamp(10rem,22vw,20rem)]">
            <div className="relative">
              <Swiper
                modules={[EffectCoverflow]}
                effect="coverflow"
                centeredSlides
                slidesPerView={1}
                initialSlide={1}
                loop
                speed={650}
                watchSlidesProgress
                coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1.15, slideShadows: false }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 2 },
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                className="mx-auto !max-w-[1100px] !overflow-visible [&_.swiper-slide]:opacity-35 [&_.swiper-slide]:transition-opacity [&_.swiper-slide-active]:opacity-100"
                aria-label="Jewelry categories"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id} className="!h-auto">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-card border border-border bg-background">
                      <Image
                        src={category.image}
                        alt={category.imageAlt}
                        fill
                        sizes="(max-width: 639px) 84vw, (max-width: 1023px) 52vw, 672px"
                        className="object-cover transition-transform duration-700 ease-editorial"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <IconButton
                label="Previous category"
                icon={<Arrow direction="left" />}
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 bg-background/80 max-sm:size-10 sm:left-6 md:left-10"
              />
              <IconButton
                label="Next category"
                icon={<Arrow direction="right" />}
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 bg-background/80 max-sm:size-10 sm:right-6 md:right-10"
              />
            </div>
          </div>
        </div>

      {activeCategory && (
        <motion.div
          className="mt-0 grid min-h-40 grid-cols-3 items-center bg-background px-4 py-6 text-center md:min-h-44 md:px-12"
          key={activeCategory.id}
          initial="hidden"
          animate="visible"
          variants={variants.fadeUp}
          aria-live="polite"
        >
          <span className="hidden font-heading text-card-title font-medium text-muted opacity-50 md:block">{previousCategory.name}</span>
          <div>
            <h3 className="font-heading text-[clamp(1.5rem,4.2vw,3rem)] font-medium leading-tight">{activeCategory.name}</h3>
            <p className="mt-2 text-body italic text-muted">{activeCategory.itemCount} items</p>
          </div>
          <span className="hidden font-heading text-card-title font-medium text-muted opacity-50 md:block">{nextCategory.name}</span>
        </motion.div>
      )}
    </section>
  );
}
