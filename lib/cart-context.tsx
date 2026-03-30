"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from "react";
import { WA_NUMBER } from "@/lib/config";
import { formatIDR } from "@/lib/utils";

export type CartItemType = "template" | "package" | "addon" | "save_the_date" | "website";

export interface CartItem {
  id: string;
  type: CartItemType;
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
  discountAmount: number;
  discountNote: string | undefined;
  finalTotal: number;
  createdAt: string;
  status: "pending" | "paid" | "confirmed" | "delivered";
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isBookingOpen: boolean;
  isPaymentOpen: boolean;
  isOrderOpen: boolean;
  orderTemplate: { name: string; slug: string; category: string } | null;
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
  | { type: "LOAD_BOOKINGS"; payload: BookingData[] }
  | { type: "UPDATE_BOOKING_STATUS"; payload: { bookingId: string; status: BookingData["status"] } }
  | { type: "OPEN_PAYMENT" }
  | { type: "CLOSE_PAYMENT" }
  | { type: "OPEN_ORDER"; payload: { name: string; slug: string; category: string } }
  | { type: "CLOSE_ORDER" };

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
    case "UPDATE_BOOKING_STATUS":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.bookingId === action.payload.bookingId
            ? { ...b, status: action.payload.status }
            : b
        ),
      };
    case "OPEN_PAYMENT":
      return { ...state, isPaymentOpen: true };
    case "CLOSE_PAYMENT":
      return { ...state, isPaymentOpen: false };
    case "OPEN_ORDER":
      return { ...state, isOrderOpen: true, orderTemplate: action.payload };
    case "CLOSE_ORDER":
      return { ...state, isOrderOpen: false, orderTemplate: null };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isBookingOpen: boolean;
  isPaymentOpen: boolean;
  isOrderOpen: boolean;
  orderTemplate: { name: string; slug: string; category: string } | null;
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
  updateBookingStatus: (bookingId: string, status: BookingData["status"]) => void;
  generateBookingId: () => string;
  getWhatsAppLink: (items: CartItem[], customer: { name: string; whatsapp: string; referralCode: string }, bookingId: string, discountAmount?: number, discountNote?: string) => string;
  openPayment: () => void;
  closePayment: () => void;
  openOrder: (template: { name: string; slug: string; category: string }) => void;
  closeOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "forvows_cart";
const BOOKINGS_KEY = "forvows_bookings";

export function generateBookingId(): string {
  // Use the browser's native Web Crypto API — universally supported, no polyfill needed
  return globalThis.crypto.randomUUID();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isBookingOpen: false,
    isPaymentOpen: false,
    isOrderOpen: false,
    orderTemplate: null,
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
    } catch {
      // Corrupted localStorage data — clear and start fresh
      console.warn("[FORVows] Cart/Bookings data was corrupted. Resetting.");
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(BOOKINGS_KEY);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch (err) {
      console.error("[FORVows] Failed to save cart:", err);
    }
  }, [state.items]);

  // Persist bookings — with a size guard to avoid QuotaExceededError.
  // Booking data can grow large (items with full metadata); cap at ~500 KB.
  useEffect(() => {
    try {
      const serialized = JSON.stringify(state.bookings);
      // 500 KB budget for bookings — safe headroom for other localStorage keys
      if (new Blob([serialized]).size > 500 * 1024) {
        console.warn("[FORVows] Bookings data exceeds 500 KB — trimming oldest entries.");
        const trimmed = state.bookings.slice(-50);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(trimmed));
      } else {
        localStorage.setItem(BOOKINGS_KEY, serialized);
      }
    } catch (err) {
      console.error("[FORVows] Failed to save bookings:", err);
    }
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
  const updateBookingStatus = (bookingId: string, status: BookingData["status"]) =>
    dispatch({ type: "UPDATE_BOOKING_STATUS", payload: { bookingId, status } });
  const openPayment = () => dispatch({ type: "OPEN_PAYMENT" });
  const closePayment = () => dispatch({ type: "CLOSE_PAYMENT" });
  const openOrder = (template: { name: string; slug: string; category: string }) =>
    dispatch({ type: "OPEN_ORDER", payload: template });
  const closeOrder = () => dispatch({ type: "CLOSE_ORDER" });

  const getWhatsAppLink = (
    items: CartItem[],
    customer: { name: string; whatsapp: string; referralCode: string },
    bookingId: string,
    discountAmount?: number,
    discountNote?: string
  ) => {
    const subtotal = items.reduce((sum, i) => sum + i.priceValue * i.quantity, 0);
    const discount = discountAmount ?? 0;
    const finalTotal = subtotal - discount;

    const typeLabel = (type: string) => {
      if (type === "template") return "Template";
      if (type === "package") return "Paket";
      if (type === "addon") return "Add-on";
      if (type === "save_the_date") return "Save the Date";
      if (type === "website") return "Wedding Website";
      return type;
    };

    let message = `Halo FOR Vows! Saya ingin booking dengan detail berikut:\n\n`;
    message += `Booking ID: ${bookingId}\n`;
    message += `Nama: ${customer.name}\n`;
    message += `WhatsApp: ${customer.whatsapp}\n`;
    if (customer.referralCode.trim()) {
      message += `Kode Referral: ${customer.referralCode.trim()}\n`;
      if (discountNote) {
        message += `Diskon: ${discountNote}\n`;
      }
    }
    message += `\nPesanan:\n`;
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} (${typeLabel(item.type)}) - ${item.price}\n`;
    });
    message += `\nSubtotal: ${formatIDR(subtotal)}\n`;
    if (discount > 0) {
      message += `Diskon: -${formatIDR(discount)}\n`;
    }
    message += `Total: ${formatIDR(finalTotal)}\n`;
    message += `\nMohon informasi lengkap untuk pembayaran. Terima kasih! 🙏`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const contextValue = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      isBookingOpen: state.isBookingOpen,
      isPaymentOpen: state.isPaymentOpen,
      isOrderOpen: state.isOrderOpen,
      orderTemplate: state.orderTemplate,
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
      updateBookingStatus,
      generateBookingId,
      getWhatsAppLink,
      openPayment,
      closePayment,
      openOrder,
      closeOrder,
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
