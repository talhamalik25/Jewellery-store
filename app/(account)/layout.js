import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

const accountLinks = [
  { href: "/cart", label: "Your bag" },
  { href: "/orders", label: "Your orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/wishlist", label: "Wishlist" },
];

export default async function AccountLayout({ children }) {
  const { user, error } = await getAuthenticatedUser();
  if (error) redirect(`/login?next=${encodeURIComponent("/cart")}`);

  return (
    <Container as="div" className="flex-1 py-12 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Card as="aside" className="h-fit p-5 md:p-6">
          <p className="font-heading text-card-title font-medium">Your account</p>
          <p className="mt-2 truncate text-caption text-muted">{user.name}</p>
          <nav aria-label="Account navigation" className="mt-5 flex gap-2 overflow-x-auto lg:flex-col">
            {accountLinks.map((link) => (
              <Link key={link.href} href={link.href} className="shrink-0 rounded-pill px-4 py-2 text-caption text-muted transition-colors hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                {link.label}
              </Link>
            ))}
          </nav>
        </Card>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
