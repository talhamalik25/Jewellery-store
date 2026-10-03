import { useId } from "react";

export default function Input({
  id,
  label,
  placeholder,
  name,
  type = "text",
  showSubmit = false,
  submitLabel = "Submit",
  className = "",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={["flex min-h-[52px] items-center gap-3 rounded-pill border border-border bg-surface py-1 pl-5 pr-1.5", className].filter(Boolean).join(" ")}>
      {label && <label className="sr-only" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className="w-full min-w-0 border-0 bg-transparent text-sm text-text outline-none placeholder:text-muted focus-visible:outline-none"
        aria-label={label ? undefined : placeholder || name}
        name={name}
        type={type}
        placeholder={placeholder}
        {...props}
      />
      {showSubmit && (
        <button
          className="inline-grid size-10 shrink-0 place-items-center rounded-full border-0 bg-text text-background transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2"
          type="submit"
          aria-label={submitLabel}
        >
          <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

