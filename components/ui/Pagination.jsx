export default function Pagination({ page, pageCount, onPageChange, className = "" }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const buttonClass = "inline-grid size-10 min-w-10 place-items-center rounded-pill border border-border px-3 text-caption transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className={["flex flex-wrap items-center justify-center gap-2", className].filter(Boolean).join(" ")}>
      <button type="button" className={buttonClass} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">←</button>
      {pages.map((pageNumber) => (
        <button key={pageNumber} type="button" className={[buttonClass, pageNumber === page ? "border-accent bg-accent text-text" : "text-muted"].join(" ")} onClick={() => onPageChange(pageNumber)} aria-current={pageNumber === page ? "page" : undefined}>
          {pageNumber}
        </button>
      ))}
      <button type="button" className={buttonClass} onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label="Next page">→</button>
    </nav>
  );
}
