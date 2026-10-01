"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function normalizeCart(cart) {
  return (cart?.items || []).map((item) => {
    const product = item.product && typeof item.product === "object" ? item.product : null;
    const id = product?._id || item.product;

    return {
      id: typeof id === "string" ? id : id?.toString(),
      name: product?.name || "Unavailable product",
      price: product?.price ?? 0,
      category: product?.category || "",
      image: product?.image || "",
      stock: product?.stock ?? 0,
      quantity: item.quantity,
    };
  });
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(response.status === 401
      ? "Please sign in to view and manage your bag."
      : data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/cart", { credentials: "same-origin" });
      const data = await readResponse(response);
      setItems(normalizeCart(data.cart));
    } catch (requestError) {
      setError(requestError.message || "Could not load your bag. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function mutateCart(url, options) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(url, { credentials: "same-origin", ...options });
      const data = await readResponse(response);
      setItems(normalizeCart(data.cart));
      return true;
    } catch (requestError) {
      setError(requestError.message || "Could not update your bag. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function addItem(product, quantity = 1) {
    const productId = product?._id || product?.id;
    if (!productId) {
      setError("This product could not be added to your bag.");
      return Promise.resolve(false);
    }
    return mutateCart("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
  }

  function updateQuantity(id, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return Promise.resolve(false);
    return mutateCart(`/api/cart/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  }

  function removeItem(id) {
    return mutateCart(`/api/cart/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  return <CartContext.Provider value={{ items, loading, busy, error, loadCart, addItem, updateQuantity, removeItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
