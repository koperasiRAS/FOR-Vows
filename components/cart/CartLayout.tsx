"use client";

import { CartProvider, useCart } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { BookingModal } from "@/components/cart/BookingModal";

function BookingModalWrapper() {
  const {
    isBookingOpen,
    closeBooking,
    pendingCustomer,
    items,
    totalPrice,
    setPendingCustomer,
    saveBooking,
    generateBookingId,
    getWhatsAppLink,
  } = useCart();

  const handleSubmit = (data: { name: string; whatsapp: string; referralCode: string }) => {
    setPendingCustomer(data);
  };

  const handleSaveAndSend = () => {
    if (!pendingCustomer) return;

    const bookingId = generateBookingId();

    saveBooking({
      bookingId,
      name: pendingCustomer.name,
      whatsapp: pendingCustomer.whatsapp,
      referralCode: pendingCustomer.referralCode,
      items: [...items],
      totalPrice,
      createdAt: new Date().toISOString(),
      status: "pending",
    });
  };

  return (
    <BookingModal
      isOpen={isBookingOpen}
      onClose={closeBooking}
      customerData={pendingCustomer ?? { name: "", whatsapp: "", referralCode: "" }}
      bookingId={generateBookingId()}
      items={items}
      totalPrice={totalPrice}
      onSubmit={handleSubmit}
      onSaveAndSend={handleSaveAndSend}
      getWhatsAppLink={getWhatsAppLink}
    />
  );
}

export function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <BookingModalWrapper />
    </CartProvider>
  );
}
