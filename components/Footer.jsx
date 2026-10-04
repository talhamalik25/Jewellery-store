import Link from "next/link";
import Container from "@/components/ui/Container";

const footerLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/#story" },
  { label: "Contact", href: "mailto:hello@atelier.example" },
  { label: "Home", href: "/" },
];

export default function Footer() {
  return (
    <footer className="bg-background pb-6 text-text" aria-label="Site footer">
      <Container>
        <div className="flex flex-col gap-5 border-t border-border pt-5 text-caption sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">© 2026 Atelier &amp; Co. All rights reserved.</p>
          <nav aria-label="Footer links">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-muted">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
