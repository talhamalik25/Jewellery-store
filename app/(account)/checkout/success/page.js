import CheckoutSuccess from "@/components/CheckoutSuccess";

export const metadata = {
  title: "Order Received | Atelier & Co.",
  description: "Your Atelier & Co. order request has been received.",
  openGraph: { type: "website", title: "Order Received | Atelier & Co.", description: "Your Atelier & Co. order request has been received." },
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";
  return <main className="min-h-[60vh]"><CheckoutSuccess orderId={orderId} /></main>;
}
