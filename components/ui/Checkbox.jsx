import { useId } from "react";

export default function Checkbox({ id, label, error, className = "", ...props }) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const errorId = error ? `${checkboxId}-error` : undefined;

  return (
    <div className={className}>
      <label htmlFor={checkboxId} className="inline-flex cursor-pointer items-start gap-3 text-body text-text">
        <input
          id={checkboxId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={[props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined}
          className="mt-1 size-4 accent-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p id={errorId} className="mt-2 text-caption text-text" role="alert">{error}</p>}
    </div>
  );
}
