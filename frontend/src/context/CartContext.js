import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, rentalDays = 3) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        toast('Item already in cart');
        return prev;
      }
      toast.success('Added to cart!');
      return [...prev, { ...product, rentalDays, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    toast.success('Removed from cart');
  };

  const updateRentalDays = (id, days) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, rentalDays: days } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerDay * item.rentalDays), 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{
      cart, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateRentalDays,
      clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
