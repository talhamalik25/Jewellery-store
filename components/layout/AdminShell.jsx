"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Container as="div" className="flex-1 py-8 md:py-12">
      <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
        <Card as="aside" className={["h-fit p-4 transition-[width] duration-300 ease-editorial", sidebarOpen ? "lg:w-60" : "lg:w-20"].join(" ")}>
          <div className="flex items-center justify-between gap-3">
            {sidebarOpen && <span className="font-heading text-caption font-medium">Admin</span>}
            <button type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} aria-expanded={sidebarOpen} className="rounded-pill border border-border px-3 py-2 text-caption text-muted hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">{sidebarOpen ? "←" : "→"}</button>
          </div>
          <nav aria-label="Admin navigation" className="mt-5 flex gap-2 overflow-x-auto lg:flex-col">
            {adminLinks.map((link) => {
              const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
              return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} title={sidebarOpen ? undefined : link.label} className={["shrink-0 rounded-pill px-4 py-3 text-caption transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft", active ? "bg-surface-alt text-text" : "text-muted"].join(" ")}>{sidebarOpen ? link.label : link.label.slice(0, 1)}</Link>;
            })}
          </nav>
        </Card>

        <div className="min-w-0">
          <Card as="header" className="mb-5 flex flex-wrap items-center gap-4 px-4 py-3 md:px-6">
            <label className="min-w-48 flex-1">
              <span className="sr-only">Search admin</span>
              <input type="search" placeholder="Search" className="min-h-10 w-full rounded-pill border border-border bg-surface px-4 text-caption text-text placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft" />
            </label>
            <div className="relative">
              <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="true" className="rounded-pill border border-border px-4 py-2 text-caption text-text hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                {user?.name || "Administrator"}
              </button>
              {profileOpen && <div role="menu" className="absolute right-0 top-full z-20 mt-2 min-w-52 rounded-card border border-border bg-surface p-4 shadow-xl">
                <p className="truncate text-caption text-text">{user?.email}</p>
                <p className="mt-1 text-caption text-muted">Administrator</p>
                <p className="mt-3 border-t border-border pt-3 text-caption text-muted">Sign out is unavailable until the backend adds a logout endpoint.</p>
              </div>}
            </div>
          </Card>
          {children}
        </div>
      </div>
    </Container>
  );
}
