import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (title) => {
    setCart((prev) => prev.filter((item) => item.title !== title));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.length;   // ✅ NEW

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
