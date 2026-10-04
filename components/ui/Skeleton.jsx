export default function Skeleton({ className = "", ...props }) {
  return <div aria-hidden="true" className={["animate-pulse rounded-chip bg-surface-alt motion-reduce:animate-none", className].filter(Boolean).join(" ")} {...props} />;
}
