export default function Button({ children, variant = "dark", className = "", ...props }) {
  const styles = variant === "outline"
    ? "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
    : "bg-stone-900 text-white hover:bg-stone-700";
  return <button className={`inline-flex min-h-12 items-center justify-center px-7 text-xs font-medium uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${styles} ${className}`} {...props}>{children}</button>;
}
