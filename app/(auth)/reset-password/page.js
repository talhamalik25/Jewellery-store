import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Reset password — Atelier & Co.",
};

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";
  return <AuthForm mode="reset" resetToken={token} />;
}
