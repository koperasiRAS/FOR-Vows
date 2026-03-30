import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/context";
import { TemplateProvider } from "@/lib/template-context";
import { CartLayout } from "@/components/cart/CartLayout";

export const metadata: Metadata = {
  title: {
    default: "Admin Portal | FOR Vows",
    template: "%s | FOR Vows Admin",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#fcf9f8] text-[#2b2b2b] antialiased">
        <LanguageProvider>
          <TemplateProvider>
            <CartLayout>
              {children}
            </CartLayout>
          </TemplateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}