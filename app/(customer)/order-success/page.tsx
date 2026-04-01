import type { Metadata } from "next";
import { OrderSuccessClient } from "./OrderSuccess";

export const metadata: Metadata = {
  title: "Order Success | FOR Vows",
  description:
    "Pesanan Anda berhasil dibuat. Selesaikan pembayaran untuk memproses undangan digital pernikahan Anda.",
};

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
