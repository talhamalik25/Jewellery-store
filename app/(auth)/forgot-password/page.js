import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Forgot password — Atelier & Co.",
};

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
