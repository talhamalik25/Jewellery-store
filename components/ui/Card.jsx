export default function Card({ as: Component = "article", interactive = false, className = "", children, ...props }) {
  return (
    <Component
      className={[
        "rounded-card border border-border bg-surface",
        interactive && "transition duration-500 ease-editorial hover:-translate-y-2 hover:bg-surface-alt",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}

