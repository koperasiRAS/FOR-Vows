import type { Metadata } from "next";
import { OrderFormClient } from "./OrderFormClient";

export const metadata: Metadata = {
  title: "Form Pemesanan | FOR Vows",
  description:
    "Pesan layanan wedding dari FOR Vows — Undangan Digital, Foto & Video, Content Creator, atau Souvenir. Isi form dan tim kami akan menghubungi kamu.",
  openGraph: {
    title: "Form Pemesanan | FOR Vows",
    description: "Pesan layanan wedding dari FOR Vows dengan mudah.",
    url: "https://for-vows.vercel.app/order",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default function OrderPage() {
  return <OrderFormClient />;
}
