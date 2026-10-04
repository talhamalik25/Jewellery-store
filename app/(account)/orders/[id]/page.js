import OrderHistory from "@/components/OrderHistory";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: "Order Details | Atelier & Co.",
    description: `Review order ${id} from Atelier & Co.`,
    openGraph: { type: "website", title: "Order Details | Atelier & Co.", description: "Review the status and details of your Atelier & Co. order." },
  };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  return <main className="min-h-[60vh] py-8 md:py-12"><OrderHistory orderId={id} /></main>;
}
