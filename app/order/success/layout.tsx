import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembayaran Berhasil | FOR Vows",
  description: "Pembayaran undangan digital Anda telah berhasil. Lihat detail pesanan dan langkah selanjutnya.",
};

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
