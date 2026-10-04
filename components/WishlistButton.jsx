"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "atelier-wishlist";

function readWishlist() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function WishlistButton({ product, compact = false }) {
  const productId = String(product?._id || product?.id || "");
  const isSaved = useCallback(() => productId ? readWishlist().includes(productId) : false, [productId]);
  const subscribe = useCallback((onChange) => {
    window.addEventListener("storage", onChange);
    window.addEventListener("atelier-wishlist-change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("atelier-wishlist-change", onChange);
    };
  }, []);
  const saved = useSyncExternalStore(subscribe, isSaved, () => false);

  function toggleSaved(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    const current = readWishlist();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("atelier-wishlist-change", { detail: next }));
    } catch { /* Storage can be disabled; the button remains unchanged. */ }
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={!productId}
      aria-label={`${saved ? "Remove" : "Add"} ${product?.name || "piece"} ${saved ? "from" : "to"} wishlist`}
      aria-pressed={saved}
      title="Saved on this device"
      className={[
        "grid shrink-0 place-items-center rounded-full border border-border bg-background/80 text-text backdrop-blur transition hover:border-accent-soft hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft disabled:opacity-40",
        compact ? "size-10" : "size-12",
      ].join(" ")}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className={compact ? "size-4" : "size-5"} fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
        <path d="M20.8 8.8c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
      </svg>
    </button>
  );
}
