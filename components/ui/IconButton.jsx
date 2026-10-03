export default function IconButton({ label, icon, className = "", type = "button", ...props }) {
  return (
    <button
      className={["inline-grid size-12 shrink-0 place-items-center rounded-full border border-border bg-transparent text-text transition duration-300 ease-editorial hover:border-accent-soft hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2", className].filter(Boolean).join(" ")}
      type={type}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}

