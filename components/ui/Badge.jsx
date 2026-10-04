export default function Badge({ children, className = "", tone = "neutral", ...props }) {
  const toneClass = tone === "accent" ? "border-accent/40 bg-accent/20 text-text" : "border-border bg-surface-alt text-muted";
  return <span className={["inline-flex items-center rounded-pill border px-3 py-1 text-caption", toneClass, className].filter(Boolean).join(" ")} {...props}>{children}</span>;
}
