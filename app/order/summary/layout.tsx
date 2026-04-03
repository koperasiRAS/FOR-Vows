import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ringkasan Pesanan | FOR Vows",
  description: "Detail dan ringkasan pesanan undangan digital Anda dari FOR Vows.",
};

export default function OrderSummaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
