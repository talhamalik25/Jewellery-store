"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/data";

const blankProduct = { name: "", price: "", category: "", description: "", image: "", stock: "0" };
const fields = [
  ["name", "Name", "text"], ["price", "Price", "number"], ["category", "Category", "text"],
  ["image", "Image URL", "url"], ["stock", "Stock", "number"], ["description", "Description", "textarea"],
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/products", { credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.products)) throw new Error(data.error || "Unable to load products.");
      setProducts(data.products);
    } catch (requestError) {
      setError(requestError.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name || "", price: String(product.price ?? ""), category: product.category || "",
      description: product.description || "", image: product.image || "", stock: String(product.stock ?? 0),
    });
    setNotice("");
  }

  function cancelEdit() {
    setEditingId("");
    setForm(blankProduct);
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save product.");
      setNotice(editingId ? "Product updated." : "Product added.");
      cancelEdit();
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete “${product.name}”?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/products/${product._id}`, { method: "DELETE", credentials: "same-origin" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to delete product.");
      if (editingId === product._id) cancelEdit();
      setNotice("Product deleted.");
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete product.");
    }
  }

  const inputClass = "mt-2 min-h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#a08352]";

  return <main>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="font-serif text-3xl">Products</h2><p className="mt-2 text-sm text-stone-600">Add and maintain the products in your collection.</p></div>
      <span className="text-xs text-stone-500">{products.length} products</span>
    </div>

    {error && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-5 border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}

    <section className="mt-7 border border-stone-200 bg-white p-5 md:p-7">
      <h3 className="font-serif text-2xl">{editingId ? "Edit product" : "Add a product"}</h3>
      <form onSubmit={saveProduct} className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label, type]) => <label key={key} className={key === "description" ? "sm:col-span-2" : ""}>
          <span className="text-xs uppercase tracking-[0.1em] text-stone-600">{label}</span>
          {type === "textarea"
            ? <textarea required rows={3} className={`${inputClass} py-3`} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            : <input required type={type} min={type === "number" ? 0 : undefined} step={key === "price" ? "0.01" : type === "number" ? "1" : undefined} className={inputClass} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />}
        </label>)}
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button disabled={saving} className="min-h-11 bg-stone-900 px-6 text-xs uppercase tracking-[0.13em] text-white hover:bg-stone-700 disabled:opacity-50">{saving ? "Saving…" : editingId ? "Save changes" : "Add product"}</button>
          {editingId && <button type="button" onClick={cancelEdit} className="min-h-11 border border-stone-300 px-6 text-xs uppercase tracking-[0.13em] hover:bg-stone-50">Cancel</button>}
        </div>
      </form>
    </section>

    <section className="mt-10">
      <h3 className="font-serif text-2xl">Collection</h3>
      {loading ? <p className="mt-5 text-sm text-stone-500" role="status">Loading products…</p>
        : products.length === 0 ? <p className="mt-5 border-y border-stone-200 py-8 text-sm text-stone-500">No products yet. Add your first product above.</p>
          : <div className="mt-5 overflow-x-auto border border-stone-200 bg-white">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-[0.12em] text-stone-500"><tr><th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Price</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead>
              <tbody className="divide-y divide-stone-200">{products.map((product) => <tr key={product._id}>
                <td className="px-4 py-4"><p className="font-medium">{product.name}</p><p className="mt-1 max-w-sm truncate text-xs text-stone-500">{product.description}</p></td>
                <td className="px-4 py-4">{product.category}</td><td className="px-4 py-4">{formatPrice(Number(product.price) || 0)}</td><td className="px-4 py-4">{product.stock}</td>
                <td className="px-4 py-4"><div className="flex gap-3 text-xs"><button type="button" onClick={() => startEdit(product)} className="underline underline-offset-4">Edit</button><button type="button" onClick={() => deleteProduct(product)} className="text-red-700 underline underline-offset-4">Delete</button></div></td>
              </tr>)}</tbody>
            </table>
          </div>}
    </section>
  </main>;
}
