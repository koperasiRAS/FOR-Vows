"use client";

import { useState } from "react";
import { CartProvider, useCart, generateBookingId } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { BookingModal } from "@/components/cart/BookingModal";
import { PaymentModal } from "@/components/cart/PaymentModal";
import { OrderModal } from "@/components/cart/OrderModal";
import { templates } from "@/lib/templates";

function BookingModalWrapper() {
  const {
    isBookingOpen,
    closeBooking,
    pendingCustomer,
    items,
    totalPrice,
    setPendingCustomer,
    saveBooking,
    getWhatsAppLink,
    openPayment,
  } = useCart();

  // Generate booking ID once when modal opens, not on every render
  const [bookingId] = useState(() => generateBookingId());

  const handleSubmit = (data: { name: string; whatsapp: string; referralCode: string }) => {
    setPendingCustomer(data);
  };

  const handleSaveAndSend = (
    discountAmount: number,
    discountNote: string | undefined
  ) => {
    if (!pendingCustomer) return;

    const booking = {
      bookingId,
      name: pendingCustomer.name,
      whatsapp: pendingCustomer.whatsapp,
      referralCode: pendingCustomer.referralCode,
      items: [...items],
      totalPrice,
      discountAmount,
      discountNote,
      finalTotal: totalPrice - discountAmount,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    };

    // Save to localStorage immediately
    saveBooking(booking);

    // Also POST to Supabase so admin dashboard can see all orders
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderCode: bookingId,
        name: pendingCustomer.name,
        phone: pendingCustomer.whatsapp,
        referralCode: pendingCustomer.referralCode,
        items: booking.items,
        totalPrice: booking.totalPrice,
        discountAmount: booking.discountAmount,
        discountNote: booking.discountNote,
        finalTotal: booking.finalTotal,
      }),
    }).catch((err) => console.error("[FORVows] Failed to sync booking to DB:", err));

    openPayment();
  };

  return (
    <BookingModal
      isOpen={isBookingOpen}
      onClose={closeBooking}
      customerData={pendingCustomer ?? { name: "", whatsapp: "", referralCode: "" }}
      bookingId={bookingId}
      items={items}
      totalPrice={totalPrice}
      onSubmit={handleSubmit}
      onSaveAndSend={handleSaveAndSend}
      getWhatsAppLink={getWhatsAppLink}
    />
  );
}

function OrderModalWrapper() {
  const { isOrderOpen, orderTemplate, closeOrder } = useCart();
  const template = orderTemplate
    ? templates.find((t) => t.slug === orderTemplate.slug) ?? null
    : null;
  return (
    <OrderModal
      isOpen={isOrderOpen}
      onClose={closeOrder}
      template={template}
    />
  );
}

export function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <BookingModalWrapper />
      <PaymentModal />
      <OrderModalWrapper />
    </CartProvider>
  );
}
