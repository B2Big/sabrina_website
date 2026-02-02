'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Service } from '@/data/content';

type CartItem = Service & { quantity: number };

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  total: number;
}

const CART_STORAGE_KEY = 'sab-fit-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // localStorage indisponible ou données corrompues
  }
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    setItems(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage plein ou indisponible
    }
  }, [items, isHydrated]);

  const addToCart = (service: Service) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== serviceId));
  };

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Calculate total price (parsing "70 €" -> 70)
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
