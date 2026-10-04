import CartContents from "@/components/CartContents";

export default function CartPage() {
  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-14 md:px-10 md:py-20"><p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Your selection</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">Your bag</h1><CartContents /></main>;
}
