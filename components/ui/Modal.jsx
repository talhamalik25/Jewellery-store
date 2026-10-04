"use client";

import { useEffect, useId, useRef } from "react";

export default function Modal({ open, onClose, title, children, className = "" }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return undefined;
  }, [open]);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose?.(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose?.(); }} className="fixed inset-0 m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-auto rounded-card border border-border bg-background p-0 text-text backdrop:bg-background/80 backdrop:backdrop-blur-sm">
      <section className={["rounded-card bg-surface p-6 shadow-xl md:p-8", className].filter(Boolean).join(" ")}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-heading text-card-title">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-pill px-3 py-1 text-caption text-muted hover:bg-surface-alt hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft" aria-label="Close dialog">Close</button>
        </div>
        {children}
      </section>
    </dialog>
  );
}
