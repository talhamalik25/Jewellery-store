import Card from "@/components/ui/Card";

export default function EmptyState({ title, description, action, className = "" }) {
  return (
    <Card className={["px-6 py-12 text-center md:px-10", className].filter(Boolean).join(" ")}>
      <h2 className="font-heading text-card-title font-medium">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-prose text-body text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
