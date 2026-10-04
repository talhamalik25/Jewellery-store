"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/products";

const emptyAddress = { fullName: "", phone: "", address: "", city: "" };
const steps = ["Address", "Shipping", "Payment", "Review"];
const addressFields = [
  { name: "fullName", label: "Full name", autoComplete: "name", maxLength: 100 },
  { name: "phone", label: "Phone number", autoComplete: "tel", maxLength: 24 },
  { name: "address", label: "Street address", autoComplete: "street-address", maxLength: 240, wide: true },
  { name: "city", label: "City", autoComplete: "address-level2", maxLength: 100 },
];

function validateAddress(address) {
  const issues = {};
  if (address.fullName.trim().length < 2) issues.fullName = "Enter the recipient’s full name.";
  if (!/^[+()\d\s.-]{7,24}$/.test(address.phone.trim())) issues.phone = "Enter a valid phone number.";
  if (address.address.trim().length < 5) issues.address = "Enter a complete street address.";
  if (address.city.trim().length < 2) issues.city = "Enter a city.";
  return issues;
}

function CheckoutSkeleton() {
  return <div className="grid gap-8 pt-10 lg:grid-cols-[minmax(0,1fr)_360px]">
    <Card className="space-y-6 p-6 md:p-8"><Skeleton className="h-6 w-40" /><Skeleton className="h-12 w-full rounded-pill" /><Skeleton className="h-12 w-full rounded-pill" /><Skeleton className="h-32 w-full rounded-card" /><Skeleton className="h-12 w-44 rounded-pill" /></Card>
    <Skeleton className="h-80 rounded-card" />
  </div>;
}

export default function CheckoutWizard() {
  const router = useRouter();
  const { items, loading, error, errorStatus, loadCart } = useCart();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(emptyAddress);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [items]);

  function changeAddress(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  function continueFromAddress(event) {
    event.preventDefault();
    const issues = validateAddress(address);
    setFieldErrors(issues);
    if (!Object.keys(issues).length) setStep(1);
  }

  async function placeOrder() {
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: Object.fromEntries(Object.entries(address).map(([key, value]) => [key, value.trim()])) }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        router.replace(`/login?next=${encodeURIComponent("/checkout")}`);
        return;
      }
      if (!response.ok) throw new Error(data.error || "The order could not be placed. Please try again.");
      await loadCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(data.order?._id || "")}`);
    } catch (requestError) {
      router.push("/checkout/failure");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="min-h-[60vh] py-8 md:py-12"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} /><p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Your selection</p><h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Checkout</h1><CheckoutSkeleton /></main>;
  if (error && errorStatus === 401) return <main className="min-h-[60vh] py-8 md:py-12"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your bag", href: "/cart" }, { label: "Checkout" }]} /><EmptyState title="Sign in to continue" description="Your bag is stored with your account. Sign in to review it at checkout." action={<Button as={Link} href={`/login?next=${encodeURIComponent("/checkout")}`}>Sign in</Button>} className="mt-10" /></main>;
  if (error) return <main className="min-h-[60vh] py-8 md:py-12"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your bag", href: "/cart" }, { label: "Checkout" }]} /><ErrorState title="We couldn’t load your bag" description={error} onRetry={loadCart} className="mt-10" /></main>;
  if (!items.length) return <main className="min-h-[60vh] py-8 md:py-12"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} /><p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Your selection</p><h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Checkout</h1><EmptyState title="Your bag is empty" description="Add a piece to your bag before continuing to checkout." action={<Button as={Link} href="/shop">Explore the collection</Button>} className="mt-10" /></main>;

  return <main className="min-h-[60vh] py-8 md:py-12">
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your bag", href: "/cart" }, { label: "Checkout" }]} />
    <p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">A considered finish</p>
    <h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Checkout</h1>

    <nav aria-label="Checkout steps" className="mt-8 overflow-x-auto border-b border-border pb-4">
      <ol className="flex min-w-max items-center gap-2 sm:gap-4">
        {steps.map((label, index) => <li key={label} className="flex items-center gap-2 sm:gap-4">
          <button type="button" disabled={index > step} onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined} className={`flex items-center gap-2 rounded-pill px-3 py-2 text-caption focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft ${step === index ? "bg-accent text-text" : index < step ? "text-text hover:bg-surface-alt" : "text-muted"}`}>
            <span className="grid size-6 place-items-center rounded-full border border-current text-[10px]">{index < step ? "✓" : index + 1}</span>{label}
          </button>
          {index < steps.length - 1 && <span aria-hidden="true" className="h-px w-4 bg-border sm:w-8" />}
        </li>)}
      </ol>
    </nav>

    <div className="grid items-start gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <section aria-live="polite">
        {step === 0 && <Card as="form" onSubmit={continueFromAddress} className="p-6 md:p-8">
          <p className="text-caption uppercase tracking-[0.16em] text-muted">Step 1 of 4</p>
          <h2 className="mt-2 font-heading text-card-title font-medium">Delivery address</h2>
          <p className="mt-3 text-body text-muted">Where should this order find you?</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {addressFields.map((field) => {
              const errorId = `checkout-${field.name}-error`;
              return <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
                <label htmlFor={`checkout-${field.name}`} className="mb-2 block text-caption text-muted">{field.label}</label>
                <input id={`checkout-${field.name}`} name={field.name} value={address[field.name]} onChange={changeAddress} autoComplete={field.autoComplete} maxLength={field.maxLength} aria-invalid={Boolean(fieldErrors[field.name])} aria-describedby={fieldErrors[field.name] ? errorId : undefined} className="min-h-[52px] w-full rounded-pill border border-border bg-background px-5 text-sm text-text outline-none transition focus-visible:border-accent-soft focus-visible:ring-2 focus-visible:ring-accent-soft/40 aria-[invalid=true]:border-[#b76b62]" />
                {fieldErrors[field.name] && <p id={errorId} role="alert" className="mt-2 text-caption text-[#f0b6ad]">{fieldErrors[field.name]}</p>}
              </div>;
            })}
          </div>
          <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">Continue to shipping</Button>
        </Card>}

        {step === 1 && <Card className="p-6 md:p-8">
          <p className="text-caption uppercase tracking-[0.16em] text-muted">Step 2 of 4</p>
          <h2 className="mt-2 font-heading text-card-title font-medium">Shipping</h2>
          <div className="mt-6 rounded-card border border-border bg-surface-alt p-5">
            <p className="text-body font-medium">Delivery address received</p>
            <address className="mt-3 space-y-1 text-caption not-italic text-muted"><p>{address.fullName}</p><p>{address.phone}</p><p>{address.address}</p><p>{address.city}</p></address>
          </div>
          <p className="mt-5 text-body text-muted">The order service records your address. Carrier choices, delivery estimates, and shipping rates aren’t available in the current backend; delivery arrangements will need to be confirmed separately.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => setStep(0)}>Back to address</Button><Button type="button" size="lg" onClick={() => setStep(2)}>Continue to payment</Button></div>
        </Card>}

        {step === 2 && <Card className="p-6 md:p-8">
          <p className="text-caption uppercase tracking-[0.16em] text-muted">Step 3 of 4</p>
          <h2 className="mt-2 font-heading text-card-title font-medium">Payment</h2>
          <div className="mt-6 rounded-card border border-border bg-surface-alt p-5">
            <p className="text-body font-medium">No online payment method is configured</p>
            <p className="mt-2 text-body text-muted">The order endpoint doesn’t accept a payment method or process a charge. No card or payment details will be collected, and no payment will be taken online.</p>
          </div>
          <p className="mt-5 text-caption text-muted">You can still submit the order request. The store will need to confirm payment arrangements with you separately.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => setStep(1)}>Back to shipping</Button><Button type="button" size="lg" onClick={() => setStep(3)}>Review order</Button></div>
        </Card>}

        {step === 3 && <Card className="p-6 md:p-8">
          <p className="text-caption uppercase tracking-[0.16em] text-muted">Step 4 of 4</p>
          <h2 className="mt-2 font-heading text-card-title font-medium">Review your order</h2>
          <div className="mt-6 border-y border-border py-5">
            <p className="text-caption uppercase tracking-[0.12em] text-muted">Deliver to</p>
            <address className="mt-3 space-y-1 text-body not-italic"><p>{address.fullName}</p><p>{address.phone}</p><p>{address.address}</p><p>{address.city}</p></address>
            <button type="button" onClick={() => setStep(0)} className="mt-3 text-caption text-muted underline underline-offset-4 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Edit address</button>
          </div>
          <div className="mt-5">
            <p className="text-caption uppercase tracking-[0.12em] text-muted">Payment</p>
            <p className="mt-2 text-body">No online payment will be collected</p>
          </div>
          <p className="mt-6 text-caption leading-relaxed text-muted">Submitting creates an order and reserves the items. Shipping fees and payment arrangements are confirmed separately.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="outline" disabled={submitting} onClick={() => setStep(2)}>Back to payment</Button><Button type="button" size="lg" disabled={submitting} onClick={placeOrder}>{submitting ? "Submitting order…" : "Submit order request"}</Button></div>
        </Card>}
      </section>

      <aside className="lg:sticky lg:top-28">
        <Card className="p-6 md:p-7">
          <h2 className="font-heading text-card-title font-medium">Order summary</h2>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {items.map((item) => <div key={item.id} className="flex gap-4 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-chip bg-surface-alt">
                <Image src={item.image || "/images/hero/gemstone-ring.webp"} alt={item.name} fill unoptimized sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1"><p className="text-caption font-medium leading-relaxed">{item.name}</p><p className="mt-1 text-caption text-muted">Qty {item.quantity} · {formatPrice(item.price)} each</p></div>
              <p className="shrink-0 text-caption">{formatPrice(item.price * item.quantity)}</p>
            </div>)}
          </div>
          <div className="mt-5 flex justify-between text-body"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="mt-3 flex justify-between text-caption text-muted"><span>Shipping</span><span>Confirmed separately</span></div>
          <div className="mt-5 flex justify-between border-t border-border pt-5 font-medium"><span>Order subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <p className="mt-3 text-caption leading-relaxed text-muted">No online payment is taken. Shipping fees aren’t included.</p>
        </Card>
      </aside>
    </div>
  </main>;
}
