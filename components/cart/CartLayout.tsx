"use client";

import { CartProvider, useCart } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { BookingModal } from "@/components/cart/BookingModal";
import { PaymentModal } from "@/components/cart/PaymentModal";
import { usePartner } from "@/lib/use-partner";

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
    openPayment,
  } = useCart();

  // Seed pendingCustomer referralCode from partner cookie on first mount
  usePartner();

  const handleSubmit = (data: { name: string; whatsapp: string; referralCode: string }) => {
    setPendingCustomer(data);
  };

  // discountAmount and discountNote come from BookingModal after referral validation
  const handleSaveAndSend = (
    _discountAmount?: number,
    _discountNote?: string
  ) => {
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

    // Auto-open payment modal after booking is saved
    openPayment();
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
      <PaymentModal />
    </CartProvider>
  );
}
