import { useId } from "react";

export default function Select({ id, label, labelHidden = false, error, options = [], className = "", children, ...props }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className="w-full">
      {label && <label htmlFor={selectId} className={labelHidden ? "sr-only" : "mb-2 block text-caption text-muted"}>{label}</label>}
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={[props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined}
        className={["min-h-12 w-full rounded-pill border border-border bg-surface px-5 text-body text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft", className].filter(Boolean).join(" ")}
        {...props}
      >
        {children || options.map((option) => typeof option === "string"
          ? <option value={option} key={option}>{option}</option>
          : <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
      {error && <p id={errorId} className="mt-2 text-caption text-text" role="alert">{error}</p>}
    </div>
  );
}
