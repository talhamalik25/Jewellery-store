"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/components/auth/AuthProvider";

const schemas = {
  login: z.object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(1, "Enter your password."),
  }),
  register: z.object({
    name: z.string().trim().min(1, "Enter your name."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(6, "Use at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  }),
  forgot: z.object({
    email: z.string().trim().email("Enter a valid email address."),
  }),
  reset: z.object({
    token: z.string().trim().min(1, "Open the secure link from your email to reset your password."),
    password: z.string().min(6, "Use at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  }),
};

const pageContent = {
  login: { eyebrow: "Welcome back", title: "Sign in", description: "Return to the pieces and moments you have saved." },
  register: { eyebrow: "A considered beginning", title: "Create your account", description: "Keep your favorite pieces close and your orders together." },
  forgot: { eyebrow: "Account access", title: "A fresh start", description: "Enter your email and we’ll send a secure link to choose a new password." },
  reset: { eyebrow: "Account access", title: "Choose a new password", description: "Create a new password for your account." },
};

function PasswordField({ name, label, autoComplete, register, error }) {
  const [visible, setVisible] = useState(false);
  const inputId = `auth-${name}`;

  return (
    <div className="relative">
      <Input
        {...register(name)}
        id={inputId}
        label={label}
        labelHidden={false}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        error={error}
        className="pr-20"
      />
      <button
        type="button"
        aria-controls={inputId}
        aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3 top-9 rounded-pill px-3 py-2 text-caption text-muted transition-colors hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function safeNextPath() {
  const requested = new URLSearchParams(window.location.search).get("next");
  if (!requested || !requested.startsWith("/") || requested.startsWith("//") || requested.startsWith("/\\")) return "/cart";
  return requested;
}

export default function AuthForm({ mode, resetToken = "" }) {
  const router = useRouter();
  const { login, register: createAccount } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const content = pageContent[mode];
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schemas[mode]),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", token: resetToken },
  });

  async function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");

    try {
      if (isRegister) {
        await createAccount({ name: values.name, email: values.email, password: values.password });
        setSuccessMessage("Your account is ready. Sign in to continue.");
        return;
      }

      if (isForgot) {
        const result = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });
        const data = await result.json();
        if (!result.ok) throw new Error(data.error || "We could not send a reset link. Please try again.");
        setSuccessMessage(data.message || "If an account exists for that email, we’ve sent a secure reset link.");
        return;
      }

      if (isReset) {
        const result = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: values.token, password: values.password }),
        });
        const data = await result.json();
        if (!result.ok) throw new Error(data.error || "We could not update your password. Please try again.");
        setSuccessMessage(data.message || "Your password has been updated.");
        return;
      }

      await login({ email: values.email, password: values.password });
      router.replace(safeNextPath());
      router.refresh();
    } catch (requestError) {
      setServerError(requestError.message || "We could not complete that request. Please try again.");
    }
  }

  const animation = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } };

  return (
    <motion.section {...animation} className="mx-auto w-full max-w-xl">
      <p className="text-caption uppercase tracking-[0.16em] text-muted">{content.eyebrow}</p>
      <h1 className="mt-3 font-heading text-hero font-medium leading-tight tracking-[-0.045em]">{content.title}</h1>
      <p className="mt-4 max-w-prose text-body text-muted">{content.description}</p>

      {isReset && !resetToken && <p className="mt-6 rounded-chip border border-[#b76b62]/50 bg-[#4b2925]/45 px-4 py-3 text-body text-[#f0b6ad]" role="alert">This reset link is missing or expired. Request a new one to continue.</p>}
      {successMessage && <p className="mt-6 rounded-card border border-border bg-surface-alt p-4 text-body text-text" role="status">{successMessage} <Link href="/login" className="underline decoration-accent-soft underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Sign in</Link></p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5" hidden={isReset && !resetToken}>
        {isRegister && <Input {...register("name")} id="auth-name" label="Name" labelHidden={false} autoComplete="name" placeholder="Your name" error={errors.name?.message} />}
        {(mode === "login" || isRegister || isForgot) && <Input {...register("email")} id="auth-email" label="Email address" labelHidden={false} type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} />}

        {isReset && <input {...register("token")} id="auth-token" type="hidden" />}
        {(mode === "login" || isRegister || isReset) && <PasswordField name="password" label={isReset ? "New password" : "Password"} autoComplete={isRegister || isReset ? "new-password" : "current-password"} register={register} error={errors.password?.message} />}
        {(isRegister || isReset) && <PasswordField name="confirmPassword" label="Confirm password" autoComplete="new-password" register={register} error={errors.confirmPassword?.message} />}

        {serverError && <p className="rounded-chip border border-[#b76b62]/50 bg-[#4b2925]/45 px-4 py-3 text-body text-[#f0b6ad]" role="alert" aria-live="assertive">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting || Boolean(successMessage)} size="lg" className="w-full disabled:pointer-events-none disabled:opacity-60">
          {isSubmitting ? "Please wait…" : isRegister ? "Create account" : isForgot ? "Send reset link" : isReset ? "Update password" : "Sign in"}
        </Button>
      </form>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-caption text-muted">
        {mode === "login" && <Link href="/forgot-password" className="transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Forgot your password?</Link>}
        {mode === "register" && <Link href="/login" className="transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Already have an account? Sign in</Link>}
        {(isForgot || isReset) && <Link href="/login" className="transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Return to sign in</Link>}
        {mode === "login" && <Link href="/register" className="transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Create an account</Link>}
      </div>
    </motion.section>
  );
}
