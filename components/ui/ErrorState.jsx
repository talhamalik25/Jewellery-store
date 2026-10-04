import Card from "@/components/ui/Card";

export default function ErrorState({ title = "Something went wrong", description, onRetry, className = "" }) {
  return (
    <Card className={["px-6 py-12 text-center md:px-10", className].filter(Boolean).join(" ")} role="alert">
      <h2 className="font-heading text-card-title font-medium">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-prose text-body text-muted">{description}</p>}
      {onRetry && <button type="button" onClick={onRetry} className="mt-6 rounded-pill border border-border px-6 py-3 text-caption text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">Try again</button>}
    </Card>
  );
}
