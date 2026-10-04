"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import { useAuth } from "@/components/auth/AuthProvider";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminShell({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Container as="div" className="flex-1 py-5 md:py-8">
      <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
        <Card as="aside" className={["h-fit p-3 transition-[width] duration-300 ease-editorial md:p-4", sidebarOpen ? "lg:w-56" : "lg:w-[4.5rem]"].join(" ")}>
          <div className="flex items-center justify-between gap-3">
            {sidebarOpen && <Link href="/admin" className="font-heading text-caption font-medium">Atelier <span className="text-accent-soft">&amp;</span> Admin</Link>}
            <button type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} aria-expanded={sidebarOpen} className="rounded-pill border border-border px-3 py-2 text-caption text-muted hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">{sidebarOpen ? "←" : "→"}</button>
          </div>
          <nav aria-label="Admin navigation" className="mt-3 flex gap-1 overflow-x-auto lg:mt-5 lg:flex-col">
            {adminLinks.map((link) => {
              const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
              const shortLabel = link.label === "Overview" ? "⌂" : link.label === "Products" ? "◇" : "≡";
              return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} title={sidebarOpen ? undefined : link.label} className={["flex shrink-0 items-center gap-3 rounded-pill px-4 py-3 text-caption transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft", !sidebarOpen && "lg:justify-center lg:px-3", active ? "bg-surface-alt text-text" : "text-muted"].filter(Boolean).join(" ")}><span aria-hidden="true" className="w-4 text-center">{shortLabel}</span>{sidebarOpen && <span>{link.label}</span>}</Link>;
            })}
          </nav>
        </Card>

        <div className="min-w-0">
          <Card as="header" className="mb-5 flex flex-wrap items-center gap-3 px-3 py-3 md:px-5">
            <form className="flex min-w-40 flex-1 gap-2" role="search" onSubmit={(event) => { event.preventDefault(); router.push(`/admin/products?search=${encodeURIComponent(search)}`); }}>
              <label className="min-w-0 flex-1"><span className="sr-only">Search products</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="min-h-10 w-full rounded-pill border border-border bg-background px-4 text-caption text-text placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft" /></label>
              <IconButton type="submit" label="Search products" className="size-10" icon={<svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.5" /><path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
            </form>
            <div className="relative">
              <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="menu" className="flex min-h-10 items-center gap-2 rounded-pill border border-border px-3 text-caption text-text hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                <span className="grid size-6 place-items-center rounded-full bg-accent/30 text-[10px]">{user?.name?.[0]?.toUpperCase() || "A"}</span><span className="hidden max-w-28 truncate sm:block">{user?.name || "Administrator"}</span><span aria-hidden="true">⌄</span>
              </button>
              {profileOpen && <div role="menu" className="absolute right-0 top-full z-20 mt-2 min-w-52 rounded-card border border-border bg-surface p-4 shadow-xl">
                <p className="truncate text-caption text-text">{user?.email}</p>
                <p className="mt-1 text-caption text-muted">Administrator</p>
                <Link role="menuitem" href="/" className="mt-3 block border-t border-border pt-3 text-caption text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Return to storefront</Link>
              </div>}
            </div>
          </Card>
          {children}
        </div>
      </div>
    </Container>
  );
}
