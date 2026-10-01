import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const { user, error } = await getAuthenticatedUser();

  if (error) {
    if (error.status === 401) redirect("/login");
    redirect("/");
  }

  if (user.role !== "admin") redirect("/");

  return <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-10 md:py-14">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-stone-200 pb-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Atelier &amp; Co.</p>
        <h1 className="mt-2 font-serif text-4xl">Admin</h1>
      </div>
      <nav aria-label="Admin navigation" className="flex gap-5 text-xs uppercase tracking-[0.12em]">
        <Link className="hover:text-[#a08352]" href="/admin">Overview</Link>
        <Link className="hover:text-[#a08352]" href="/admin/products">Products</Link>
        <Link className="hover:text-[#a08352]" href="/admin/orders">Orders</Link>
      </nav>
    </div>
    {children}
  </div>;
}
