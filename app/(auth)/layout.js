import Image from "next/image";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

export default function AuthLayout({ children }) {
  return (
    <main className="flex flex-1 items-center py-8 md:py-16">
      <Container>
        <Card as="div" className="mx-auto grid w-full max-w-container overflow-hidden p-0 md:grid-cols-2">
          <aside className="relative hidden min-h-[560px] md:block lg:min-h-[640px]">
            <Image
              src="/images/hero/hero-model.webp"
              alt="Model wearing a diamond necklace"
              fill
              priority
              sizes="(max-width: 1023px) 50vw, 640px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-overlay" aria-hidden="true" />
            <div className="absolute inset-x-8 bottom-8">
              <p className="font-heading text-card-title font-medium text-text">Made to stay with you.</p>
              <p className="mt-2 max-w-xs text-body text-text">Considered pieces for the moments that make a life.</p>
            </div>
          </aside>
          <div className="flex items-center p-6 sm:p-8 lg:p-12">
            <div className="w-full">{children}</div>
          </div>
        </Card>
      </Container>
    </main>
  );
}
