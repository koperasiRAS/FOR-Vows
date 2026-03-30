import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartLayout } from "@/components/cart/CartLayout";
import { LanguageProvider } from "@/lib/i18n/context";
import { TemplateProvider } from "@/lib/template-context";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "FOR Vows | Crafting Your Sacred Moments",
    template: "%s | FOR Vows",
  },
  description:
    "Premium digital wedding invitations crafted with elegance. FOR Vows transforms your sacred moments into timeless digital experiences, a luxury sub-brand of Frame Of Rangga.",
  keywords: [
    "wedding invitation",
    "digital invitation",
    "premium wedding",
    "luxury wedding invitation",
    "wedding website",
    "digital wedding card",
  ],
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💍</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="flex flex-col min-h-screen bg-[#0a0a0a] text-[#faf8f5] antialiased">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(201,169,110,0.2)",
              color: "#faf8f5",
              fontSize: "13px",
            },
          }}
        />
        <LanguageProvider>
          <TemplateProvider>
            <CartLayout>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartLayout>
          </TemplateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
