import { forwardRef, useId } from "react";

const Input = forwardRef(function Input({
  id,
  label,
  placeholder,
  name,
  type = "text",
  showSubmit = false,
  submitLabel = "Submit",
  labelHidden = true,
  error,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  className = "",
  ...props
}, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      {label && <label className={labelHidden ? "sr-only" : "mb-2 block text-caption text-muted"} htmlFor={inputId}>{label}</label>}
      <div className={["flex min-h-[52px] items-center gap-3 rounded-pill border border-border bg-surface py-1 pl-5 pr-1.5 transition-colors focus-within:border-accent-soft focus-within:ring-2 focus-within:ring-accent-soft/40", className, error && "border-accent-soft"].filter(Boolean).join(" ")}>
      <input
        ref={ref}
        id={inputId}
        className="w-full min-w-0 border-0 bg-transparent text-sm text-text outline-none placeholder:text-muted focus-visible:outline-none"
        aria-label={label ? undefined : placeholder || name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error || ariaInvalid)}
        aria-describedby={[describedBy, errorId].filter(Boolean).join(" ") || undefined}
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
      {error && <p id={errorId} className="mt-2 text-caption text-[#f0b6ad]" role="alert">{error}</p>}
    </div>
  );
});

export default Input;

