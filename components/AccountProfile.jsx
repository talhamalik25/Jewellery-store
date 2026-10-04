"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";

export default function AccountProfile() {
  const { user, status, error, refreshUser } = useAuth();

  if (status === "loading") return <main className="min-h-[60vh] py-8 md:py-12"><Skeleton className="h-4 w-28" /><Skeleton className="mt-8 h-12 w-64" /><Card className="mt-8 space-y-5 p-6"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-full rounded-pill" /><Skeleton className="h-12 w-full rounded-pill" /></Card></main>;
  if (!user) return <main className="min-h-[60vh] py-8 md:py-12"><ErrorState title="We couldn’t load your profile" description={error || "Sign in again to view your account details."} onRetry={refreshUser} /><div className="mt-5 text-center"><Button as={Link} href={`/login?next=${encodeURIComponent("/account/profile")}`}>Sign in</Button></div></main>;

  return <main className="min-h-[60vh] py-8 md:py-12">
    <Breadcrumbs items={[{ label: "Account", href: "/account/profile" }, { label: "Profile" }]} />
    <p className="mt-8 text-caption uppercase tracking-[0.16em] text-muted">Your account</p>
    <h1 className="mt-3 font-heading text-section font-medium tracking-[-0.05em]">Profile</h1>
    <p className="mt-4 text-body text-muted">Your sign-in details and account information.</p>
    <Card className="mt-8 max-w-2xl p-6 md:p-8">
      <dl className="divide-y divide-border">
        <div className="py-4 first:pt-0"><dt className="text-caption text-muted">Name</dt><dd className="mt-2 text-body">{user.name}</dd></div>
        <div className="py-4"><dt className="text-caption text-muted">Email address</dt><dd className="mt-2 break-all text-body">{user.email}</dd></div>
        <div className="py-4 last:pb-0"><dt className="text-caption text-muted">Account type</dt><dd className="mt-2 text-body capitalize">{user.role}</dd></div>
      </dl>
      <p className="mt-7 border-t border-border pt-5 text-caption leading-relaxed text-muted">Profile editing and email changes aren’t available through the current account API.</p>
    </Card>
  </main>;
}
