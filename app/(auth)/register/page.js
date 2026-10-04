import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Create an account — Atelier & Co.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
