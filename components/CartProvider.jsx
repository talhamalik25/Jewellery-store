"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

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
    const error = new Error(response.status === 401
      ? "Please sign in to view and manage your bag."
      : data.error || "Something went wrong. Please try again.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export function CartProvider({ children }) {
  const { status: authStatus } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState(0);
  const [busy, setBusy] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    setErrorStatus(0);
    try {
      const response = await fetch("/api/cart", { credentials: "same-origin" });
      const data = await readResponse(response);
      setItems(normalizeCart(data.cart));
      setErrorStatus(0);
    } catch (requestError) {
      setError(requestError.message || "Could not load your bag. Please try again.");
      setErrorStatus(requestError.status || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadCart);
  }, [loadCart]);

  useEffect(() => {
    if (authStatus === "authenticated" && errorStatus === 401) {
      void Promise.resolve().then(loadCart);
    }
  }, [authStatus, errorStatus, loadCart]);

  async function mutateCart(url, options) {
    setBusy(true);
    setError("");
    setErrorStatus(0);
    try {
      const response = await fetch(url, { credentials: "same-origin", ...options });
      const data = await readResponse(response);
      setItems(normalizeCart(data.cart));
      setErrorStatus(0);
      return { success: true };
    } catch (requestError) {
      setError(requestError.message || "Could not update your bag. Please try again.");
      setErrorStatus(requestError.status || 0);
      return {
        success: false,
        status: requestError.status || 0,
        message: requestError.message || "Could not update your bag. Please try again.",
      };
    } finally {
      setBusy(false);
    }
  }

  function addItem(product, quantity = 1) {
    const productId = product?._id || product?.id;
    if (!productId) {
      setError("This product could not be added to your bag.");
      return Promise.resolve({ success: false, status: 0, message: "This product could not be added to your bag." });
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

  return <CartContext.Provider value={{ items, loading, busy, error, errorStatus, loadCart, addItem, updateQuantity, removeItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
