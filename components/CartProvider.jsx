"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product, quantity) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item);
      }
      return [...current, { ...product, quantity }];
    });
  }

  function updateQuantity(id, quantity) {
    setItems((current) => current
      .map((item) => item.id === id ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
