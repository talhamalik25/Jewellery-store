"use client";

import { useRouter } from "next/navigation";
import ErrorState from "@/components/ui/ErrorState";

export default function DashboardRetry({ message }) {
  const router = useRouter();
  return <ErrorState title="Dashboard data is unavailable" description={message} onRetry={() => router.refresh()} />;
}
