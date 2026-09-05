'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { type Service } from '@/data/content';

type CartItem = Service & { quantity: number };

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Parse price safely - handles "70 €" format
function parsePrice(price: string): number {
  if (!price || typeof price !== 'string') return 0;
  const numeric = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numeric);
  return isNaN(parsed) ? 0 : parsed;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Panier vide à chaque chargement de page (pas de persistance)
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((service: Service) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((serviceId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== serviceId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate total price (parsing "70 €" -> 70)
  const total = useMemo(
    () => items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [items]
  );

  // 🔥 Value mémoïsée : évite le re-render de TOUTE la page (12 ServiceCard + FloatingCart + formulaire)
  // à chaque changement du panier — seuls les consommateurs de useCart re-rendent.
  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, clearCart, total }),
    [items, total, addToCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
