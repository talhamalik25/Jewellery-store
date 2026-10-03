const variants = {
  primary: "border-transparent bg-text text-background hover:brightness-110",
  outline: "border-border bg-transparent text-text hover:border-accent-soft hover:bg-surface",
  ghost: "border-transparent bg-transparent text-text hover:bg-surface",
};

const sizes = {
  sm: "min-h-9 px-4 text-caption",
  md: "min-h-11 px-6 text-caption",
  lg: "min-h-[52px] px-8 text-sm",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  children,
  type,
  ...props
}) {
  return (
    <Component
      className={[
        "group inline-flex items-center justify-center gap-3 rounded-pill border font-medium transition duration-300 ease-editorial focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].filter(Boolean).join(" ")}
      type={Component === "button" ? type || "button" : type}
      {...props}
    >
      {children}
      {arrow && <span className="inline-block transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden="true">→</span>}
    </Component>
  );
}

