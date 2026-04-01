import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartLayout } from "@/components/cart/CartLayout";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartLayout>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartLayout>
  );
}
