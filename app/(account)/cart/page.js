import CartContents from "@/components/CartContents";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "Your Bag | Atelier & Co.",
  description: "Review the considered pieces in your Atelier & Co. bag.",
  openGraph: { type: "website", title: "Your Bag | Atelier & Co.", description: "Review the pieces in your Atelier & Co. bag." },
};

export default function CartPage() {
  return <main className="min-h-[60vh] py-8 md:py-12"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your bag" }]} /><p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Your selection</p><h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Your bag</h1><CartContents /></main>;
}
