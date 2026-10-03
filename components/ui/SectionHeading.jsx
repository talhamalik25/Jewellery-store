export default function SectionHeading({ title, description, action, eyebrow, as: Heading = "h2", className = "" }) {
  return (
    <header className={["flex items-end justify-between gap-6 max-md:flex-col max-md:items-start", className].filter(Boolean).join(" ")}>
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-3 text-caption uppercase tracking-widest text-muted">{eyebrow}</p>}
        <Heading className="font-heading text-section font-medium leading-tight tracking-[-0.045em]">{title}</Heading>
        {description && <p className="mt-4 max-w-2xl text-body leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}

