"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from "react";

export type CartItemType = "template" | "package" | "addon" | "save_the_date" | "website";

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_OPEN":
      return { ...state, isOpen: action.payload };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "forvows_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      }
    } catch {
      console.warn("[FORVows] Cart data was corrupted. Resetting.");
      localStorage.removeItem(CART_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch (err) {
      console.error("[FORVows] Failed to save cart:", err);
    }
  }, [state.items]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.priceValue * i.quantity, 0);

  const addItem = (item: Omit<CartItem, "quantity">) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const setOpen = (open: boolean) => dispatch({ type: "SET_OPEN", payload: open });

  const contextValue = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      totalPrice,
      addItem,
      removeItem,
      clearCart,
      setOpen,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
