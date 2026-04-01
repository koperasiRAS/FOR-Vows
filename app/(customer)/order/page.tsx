import type { Metadata } from "next";
import { OrderFormClient } from "./OrderFormClient";

export const metadata: Metadata = {
  title: "Pesan Undangan | FOR Vows",
  description:
    "Pesan undangan pernikahan digital premium di FOR Vows. Pilih paket, isi data couple, dan selesaikan pembayaran dengan Midtrans.",
  openGraph: {
    title: "Pesan Undangan | FOR Vows",
    description: "Pesan undangan pernikahan digital premium dengan mudah.",
    url: "https://for-vows.vercel.app/order",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default function OrderPage() {
  return <OrderFormClient />;
}
