import { useId } from "react";

export default function Textarea({ id, label, labelHidden = false, error, className = "", ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className={labelHidden ? "sr-only" : "mb-2 block text-caption text-muted"}>{label}</label>}
      <textarea
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={[props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined}
        className={["min-h-32 w-full resize-y rounded-card border border-border bg-surface px-5 py-4 text-body text-text placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft", className].filter(Boolean).join(" ")}
        {...props}
      />
      {error && <p id={errorId} className="mt-2 text-caption text-text" role="alert">{error}</p>}
    </div>
  );
}
