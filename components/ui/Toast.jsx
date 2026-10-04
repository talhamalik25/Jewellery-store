"use client";

export default function Toast({ open = true, title, message, onDismiss, role = "status", className = "" }) {
  if (!open) return null;
  return (
    <div role={role} aria-live={role === "alert" ? "assertive" : "polite"} className={["fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-4 rounded-card border border-border bg-surface px-5 py-4 text-text shadow-xl", className].filter(Boolean).join(" ")}>
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {message && <p className="mt-1 text-caption text-muted">{message}</p>}
      </div>
      {onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="rounded-pill px-2 text-caption text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">×</button>}
    </div>
  );
}
