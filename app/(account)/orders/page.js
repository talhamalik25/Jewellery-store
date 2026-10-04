import OrderHistory from "@/components/OrderHistory";

export const metadata = {
  title: "Your Orders | Atelier & Co.",
  description: "Review the status and details of your Atelier & Co. orders.",
  openGraph: { type: "website", title: "Your Orders | Atelier & Co.", description: "Review your Atelier & Co. orders." },
};

export default function OrdersPage() {
  return <main className="min-h-[60vh] py-8 md:py-12"><OrderHistory /></main>;
}
