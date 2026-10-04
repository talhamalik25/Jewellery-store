import { redirect } from "next/navigation";
import AdminShell from "@/components/layout/AdminShell";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const { user, error } = await getAuthenticatedUser();

  if (error) {
    if (error.status === 401) redirect("/login");
    redirect("/");
  }

  if (user.role !== "admin") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
