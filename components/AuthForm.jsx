"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const response = await fetch(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      if (isRegister) {
        router.push("/login");
      } else {
        window.location.assign("/cart");
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to connect. Please try again.");
      setLoading(false);
    }
  }

  return <main className="mx-auto flex min-h-[60vh] max-w-7xl items-start justify-center px-5 py-14 md:px-10 md:py-20">
    <section className="w-full max-w-md">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08352]">Atelier &amp; Co.</p>
      <h1 className="mt-3 font-serif text-4xl">{isRegister ? "Create an account" : "Welcome back"}</h1>
      <p className="mt-3 text-sm text-stone-500">{isRegister ? "Join us to keep your considered pieces together." : "Sign in to view your bag and account."}</p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        {isRegister && <label className="block text-xs uppercase tracking-[0.12em] text-stone-600">Name<input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 block h-12 w-full border border-stone-300 bg-transparent px-3 text-sm normal-case tracking-normal text-stone-900 outline-none focus:border-stone-900" /></label>}
        <label className="block text-xs uppercase tracking-[0.12em] text-stone-600">Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block h-12 w-full border border-stone-300 bg-transparent px-3 text-sm normal-case tracking-normal text-stone-900 outline-none focus:border-stone-900" /></label>
        <label className="block text-xs uppercase tracking-[0.12em] text-stone-600">Password<input type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 6 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 block h-12 w-full border border-stone-300 bg-transparent px-3 text-sm normal-case tracking-normal text-stone-900 outline-none focus:border-stone-900" /></label>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Please wait…" : isRegister ? "Create account" : "Sign in"}</Button>
      </form>

      <p className="mt-7 text-center text-sm text-stone-500">{isRegister ? "Already have an account? " : "New to Atelier & Co.? "}<Link href={isRegister ? "/login" : "/register"} className="text-stone-900 underline underline-offset-4">{isRegister ? "Sign in" : "Create an account"}</Link></p>
    </section>
  </main>;
}
