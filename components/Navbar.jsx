"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import IconButton from "@/components/ui/IconButton";
import { heroContent } from "@/data/hero";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar({ variant }) {
  const { items } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const isHero = variant === "hero";

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  if (!isHero && pathname === "/") return null;

  if (isHero) {
    const closeMenu = () => setMenuOpen(false);
    const menuState = menuOpen
      ? "pointer-events-auto visible max-h-96 translate-y-0 opacity-100"
      : "pointer-events-none invisible max-h-0 -translate-y-2 opacity-0";

    return (
      <header className="sticky top-0 z-50 w-full bg-background/70 py-3 backdrop-blur-xl">
        <Container className="relative">
          <div className="flex min-h-14 items-center justify-between gap-4 rounded-pill border border-border bg-background/85 px-4 backdrop-blur-xl">
            <Link href="/" className="shrink-0 font-heading text-xs font-semibold tracking-wide text-text" aria-label={heroContent.brand + " home"} onClick={closeMenu}>
              {heroContent.brand}
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 text-caption text-muted md:flex md:gap-2 md:text-[11px] lg:gap-4 lg:text-caption xl:gap-6" aria-label="Main navigation">
              {heroContent.navigation.map((item) => (
                <Link key={item.label} className="transition-colors duration-300 hover:text-text" href={item.href} aria-current={item.href === "/" ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto hidden items-center gap-2 lg:flex">
              <IconButton label="Search" icon={<SearchIcon />} />
              <Button as={Link} href="/shop" variant="outline" size="sm" className="min-w-20">Shop</Button>
              <Button as={Link} href="/login" variant="primary" size="sm" className="min-w-20">Login</Button>
            </div>

            <div className="ml-auto flex items-center gap-2 lg:hidden">
              <Button as={Link} href="/login" variant="primary" size="sm">Login</Button>
              <button
                className="inline-flex size-9 flex-col items-center justify-center gap-1.5 rounded-full border border-border bg-transparent text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2"
                type="button"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="home-mobile-navigation"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className={menuOpen ? "h-px w-3.5 translate-y-1 rotate-45 bg-current" : "h-px w-3.5 bg-current"} />
                <span className={menuOpen ? "h-px w-3.5 -translate-y-1 -rotate-45 bg-current" : "h-px w-3.5 bg-current"} />
              </button>
            </div>
          </div>

          <nav
            className={"absolute left-4 right-4 top-full z-20 mt-2 flex flex-col overflow-hidden rounded-card border border-border bg-surface/95 px-4 transition duration-300 ease-editorial lg:hidden " + menuState}
            id="home-mobile-navigation"
            aria-label="Mobile navigation"
            aria-hidden={!menuOpen}
          >
            {heroContent.navigation.map((item) => (
              <Link key={item.label} className="border-b border-border py-3 text-sm text-text last:border-0" href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
            <div className="py-3">
              <Button as={Link} href="/shop" variant="outline" size="sm" className="w-full" onClick={closeMenu}>Shop</Button>
            </div>
          </nav>
        </Container>
      </header>
    );
  }

  return (
    <header className="border-b border-stone-200 bg-[#faf9f6]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.12em]">ATELIER <span className="text-[#aa8752]">&</span> CO.</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-[11px] uppercase tracking-[0.15em] sm:gap-9">
          <Link className="hover:text-[#aa8752]" href="/shop">Shop</Link>
          <Link className="hover:text-[#aa8752]" href="/#story">Our story</Link>
          <Link className="hover:text-[#aa8752]" href="/cart">Bag <span aria-label={itemCount + " items"}>({itemCount})</span></Link>
        </nav>
      </div>
    </header>
  );
}
