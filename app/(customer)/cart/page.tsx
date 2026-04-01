import type { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Keranjang | FOR Vows",
  description:
    "Lihat dan kelola item di keranjang pesanan undangan digital pernikahan Anda.",
};

export default function CartPage() {
  return <CartClient />;
}
