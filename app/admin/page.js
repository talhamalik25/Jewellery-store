import Link from "next/link";

export default function AdminDashboardPage() {
  return <main>
    <h2 className="font-serif text-3xl">Dashboard overview</h2>
    <p className="mt-2 text-sm text-stone-600">Manage the collection and keep track of customer orders.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <Link href="/admin/products" className="border border-stone-200 bg-white p-7 transition-colors hover:border-[#a08352]">
        <p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">Catalogue</p>
        <h3 className="mt-3 font-serif text-2xl">Manage products</h3>
        <p className="mt-2 text-sm text-stone-600">Add pieces, update details, and manage stock.</p>
      </Link>
      <Link href="/admin/orders" className="border border-stone-200 bg-white p-7 transition-colors hover:border-[#a08352]">
        <p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">Fulfilment</p>
        <h3 className="mt-3 font-serif text-2xl">Manage orders</h3>
        <p className="mt-2 text-sm text-stone-600">Review purchases and update their status.</p>
      </Link>
    </div>
  </main>;
}
