"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { formatPrice } from "@/lib/data";

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(emptyAddress);

  useEffect(() => {
    let active = true;

    async function loadCart() {
      try {
        const response = await fetch("/api/cart", { credentials: "same-origin" });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error(data.error || "Unable to load your bag.");

        const cartItems = data.cart?.items;
        if (!Array.isArray(cartItems)) throw new Error("The cart response was invalid.");
        if (active) setItems(cartItems);
      } catch (requestError) {
        if (active) setError(requestError.message || "Unable to load your bag. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCart();
    return () => { active = false; };
  }, [router]);

  const total = items.reduce((sum, item) => {
    const price = Number(item.product?.price);
    const quantity = Number(item.quantity);
    return sum + (Number.isFinite(price) && Number.isFinite(quantity) ? price * quantity : 0);
  }, 0);

  function handleAddressChange(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const shippingAddress = Object.fromEntries(
      Object.entries(address).map(([key, value]) => [key, value.trim()]),
    );
    if (Object.values(shippingAddress).some((value) => !value)) {
      setError("Please complete every shipping address field.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) throw new Error(data.error || "Unable to place your order.");

      router.push("/orders");
    } catch (requestError) {
      setError(requestError.message || "Unable to place your order. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 text-sm text-stone-500 md:px-10 md:py-20" role="status">Loading checkout…</main>;
  }

  if (error && items.length === 0) {
    return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20"><p className="text-sm text-red-700" role="alert">{error}</p><Link href="/cart" className="mt-5 inline-block text-sm underline underline-offset-4">Return to your bag</Link></main>;
  }

  if (items.length === 0) {
    return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20"><p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Your selection</p><h1 className="mt-3 font-serif text-4xl">Checkout</h1><div className="mt-10 border-y border-stone-200 py-12 text-center"><p className="font-serif text-2xl">Your bag is empty</p><Link href="/shop" className="mt-5 inline-block text-sm underline underline-offset-4">Explore the collection</Link></div></main>;
  }

  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20">
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Your selection</p>
    <h1 className="mt-3 font-serif text-4xl md:text-5xl">Checkout</h1>

    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} className="space-y-7">
        <section>
          <h2 className="font-serif text-2xl">Shipping address</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              { name: "fullName", label: "Full name", autoComplete: "name" },
              { name: "phone", label: "Phone", autoComplete: "tel" },
              { name: "address", label: "Address", autoComplete: "street-address", wide: true },
              { name: "city", label: "City", autoComplete: "address-level2" },
            ].map((field) => <label key={field.name} className={`block text-xs uppercase tracking-[0.12em] text-stone-600 ${field.wide ? "sm:col-span-2" : ""}`}>
              {field.label}
              <input name={field.name} value={address[field.name]} onChange={handleAddressChange} autoComplete={field.autoComplete} required className="mt-2 block h-12 w-full border border-stone-300 bg-transparent px-3 text-sm normal-case tracking-normal text-stone-900 outline-none focus:border-stone-900" />
            </label>)}
          </div>
        </section>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">{submitting ? "Placing order…" : "Place Order"}</Button>
      </form>

      <aside className="h-fit border border-stone-200 p-6">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          {items.map((item, index) => {
            const product = item.product;
            const price = Number(product?.price);
            const quantity = Number(item.quantity);
            return <div key={product?._id || index} className="flex justify-between gap-4 py-4 text-sm">
              <div><p>{product?.name || "Unavailable product"}</p><p className="mt-1 text-xs text-stone-500">Qty {quantity} × {formatPrice(Number.isFinite(price) ? price : 0)}</p></div>
              <span className="shrink-0">{formatPrice(Number.isFinite(price * quantity) ? price * quantity : 0)}</span>
            </div>;
          })}
        </div>
        <div className="mt-5 flex justify-between border-t border-stone-200 pt-5 font-medium"><span>Total</span><span>{formatPrice(total)}</span></div>
      </aside>
    </div>
  </main>;
}
