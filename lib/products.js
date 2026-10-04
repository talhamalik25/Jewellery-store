export function slugifyProductName(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductSlug(product) {
  const nameSlug = slugifyProductName(product?.name);
  const id = String(product?._id || product?.id || "");
  return id ? `${nameSlug}-${id.slice(-6)}` : nameSlug;
}

export function formatPrice(price) {
  const value = Number(price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}
