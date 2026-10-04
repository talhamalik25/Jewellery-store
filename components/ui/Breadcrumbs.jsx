import Link from "next/link";

export default function Breadcrumbs({ items, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-caption text-muted">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href && index < items.length - 1
              ? <Link href={item.href} className="transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">{item.label}</Link>
              : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
