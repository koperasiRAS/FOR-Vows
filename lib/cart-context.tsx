"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from "react";

export interface CartItem {
  id: string;
  type: "template" | "package" | "addon";
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
}

export interface BookingData {
  bookingId: string;
  name: string;
  whatsapp: string;
  referralCode: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: "pending" | "paid" | "confirmed" | "delivered";
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isBookingOpen: boolean;
  bookings: BookingData[];
  pendingCustomer: { name: string; whatsapp: string; referralCode: string } | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "OPEN_BOOKING" }
  | { type: "CLOSE_BOOKING" }
  | { type: "SET_PENDING_CUSTOMER"; payload: { name: string; whatsapp: string; referralCode: string } }
  | { type: "SAVE_BOOKING"; payload: BookingData }
  | { type: "LOAD_BOOKINGS"; payload: BookingData[] };

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
    case "OPEN_BOOKING":
      return { ...state, isBookingOpen: true };
    case "CLOSE_BOOKING":
      return { ...state, isBookingOpen: false, pendingCustomer: null };
    case "SET_PENDING_CUSTOMER":
      return { ...state, pendingCustomer: action.payload };
    case "SAVE_BOOKING":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
        items: [],
        isBookingOpen: false,
        isOpen: false,
        pendingCustomer: null,
      };
    case "LOAD_BOOKINGS":
      return { ...state, bookings: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isBookingOpen: boolean;
  bookings: BookingData[];
  pendingCustomer: { name: string; whatsapp: string; referralCode: string } | null;
  itemCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  openBooking: () => void;
  closeBooking: () => void;
  setPendingCustomer: (data: { name: string; whatsapp: string; referralCode: string }) => void;
  saveBooking: (booking: BookingData) => void;
  generateBookingId: () => string;
  getWhatsAppLink: (customer: { name: string; whatsapp: string; referralCode: string }, bookingId: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "forvows_cart";
const BOOKINGS_KEY = "forvows_bookings";

export function generateBookingId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FORV-${year}${month}${day}-${rand}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isBookingOpen: false,
    bookings: [],
    pendingCustomer: null,
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      }
      const savedBookings = localStorage.getItem(BOOKINGS_KEY);
      if (savedBookings) {
        dispatch({ type: "LOAD_BOOKINGS", payload: JSON.parse(savedBookings) });
      }
    } catch {}
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  // Persist bookings
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(state.bookings));
    } catch {}
  }, [state.bookings]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.priceValue * i.quantity, 0);

  const addItem = (item: Omit<CartItem, "quantity">) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const setOpen = (open: boolean) => dispatch({ type: "SET_OPEN", payload: open });
  const openBooking = () => dispatch({ type: "OPEN_BOOKING" });
  const closeBooking = () => dispatch({ type: "CLOSE_BOOKING" });
  const setPendingCustomer = (data: { name: string; whatsapp: string; referralCode: string }) =>
    dispatch({ type: "SET_PENDING_CUSTOMER", payload: data });
  const saveBooking = (booking: BookingData) => dispatch({ type: "SAVE_BOOKING", payload: booking });

  const getWhatsAppLink = (
    customer: { name: string; whatsapp: string; referralCode: string },
    bookingId: string
  ) => {
    const waNumber = "6287779560264";
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(totalPrice);

    const typeLabel = (type: string) =>
      type === "template" ? "Template" : type === "package" ? "Paket" : "Add-on";

    let message = `Halo FOR Vows! Saya ingin booking dengan detail berikut:\n\n`;
    message += `Booking ID: ${bookingId}\n`;
    message += `Nama: ${customer.name}\n`;
    message += `WhatsApp: ${customer.whatsapp}\n`;
    if (customer.referralCode.trim()) {
      message += `Kode Referral: ${customer.referralCode.trim()}\n`;
    }
    message += `\nPesanan:\n`;
    state.items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} (${typeLabel(item.type)}) - ${item.price}\n`;
    });
    message += `\nTotal: ${formatted}\n`;
    message += `\nMohon informasi lengkap untuk pembayaran. Terima kasih! 🙏`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  const contextValue = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      isBookingOpen: state.isBookingOpen,
      bookings: state.bookings,
      pendingCustomer: state.pendingCustomer,
      itemCount,
      totalPrice,
      addItem,
      removeItem,
      clearCart,
      setOpen,
      openBooking,
      closeBooking,
      setPendingCustomer,
      saveBooking,
      generateBookingId,
      getWhatsAppLink,
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
