import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const metadata = {
  title: "Order Not Confirmed | Atelier & Co.",
  description: "We couldn’t confirm your Atelier & Co. order request.",
  openGraph: { type: "website", title: "Order Not Confirmed | Atelier & Co.", description: "We couldn’t confirm your Atelier & Co. order request." },
};

export default function CheckoutFailurePage() {
  return <main className="mx-auto min-h-[60vh] max-w-2xl py-10 md:py-16">
    <Card className="px-6 py-10 text-center md:px-10 md:py-14">
      <div className="mx-auto grid size-14 place-items-center rounded-full border border-[#b76b62]/50 bg-[#4b2925]/45 text-xl text-[#f0b6ad]" aria-hidden="true">!</div>
      <p className="mt-6 text-caption uppercase tracking-[0.16em] text-muted">Order not confirmed</p>
      <h1 className="mt-3 font-heading text-card-title font-medium">We couldn’t complete that request.</h1>
      <p className="mx-auto mt-4 max-w-prose text-body text-muted">Check your order history before trying again in case the request reached us. If there’s no order listed, you can return to checkout.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3"><Button as={Link} href="/orders" variant="outline">Check your orders</Button><Button as={Link} href="/checkout">Return to checkout</Button></div>
    </Card>
  </main>;
}
