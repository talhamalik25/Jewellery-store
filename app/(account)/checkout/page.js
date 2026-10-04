import CheckoutWizard from "@/components/CheckoutWizard";

export const metadata = {
  title: "Checkout | Atelier & Co.",
  description: "Confirm your delivery details and review your Atelier & Co. order.",
  openGraph: { type: "website", title: "Checkout | Atelier & Co.", description: "Review your Atelier & Co. order." },
};

export default function CheckoutPage() {
  return <CheckoutWizard />;
}
