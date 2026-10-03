"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomeMotion({ children }) {
  const root = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;
      gsap.fromTo(".hero-copy > *", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.09, ease: "power2.out", delay: 0.18 });
      gsap.fromTo(".hero-promos .promo-card", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.12, delay: 0.45, ease: "power2.out" });
      gsap.utils.toArray(".home-page .section-heading, .home-page .new-heading, .home-page .collection-feature, .home-page .review-card, .home-page .bespoke-copy").forEach((element) => {
        gsap.fromTo(element, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      });
    }, root);
    return () => context.revert();
  }, [pathname]);

  return <div ref={root} className="contents">{children}</div>;
}
