import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond, Noto_Serif } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
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

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://for-vows.vercel.app"),
  title: {
    default: "FOR Vows — Wedding Creative Studio | Undangan Digital, Foto & Video, Content Creator",
    template: "%s | FOR Vows",
  },
  description:
    "Wedding creative studio premium dari Frame Of Rangga. Undangan digital, foto & video sinematik, wedding content creator, dan desain souvenir untuk pernikahan impian Anda.",
  keywords: [
    "wedding creative studio",
    "undangan pernikahan digital",
    "foto video wedding",
    "wedding content creator",
    "desain souvenir pernikahan",
    "premium wedding invitation",
    "undangan digital premium",
    "fotografer pernikahan",
    "videografer pernikahan",
    "frame of rangga",
    "for vows",
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
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} ${notoSerif.variable} scroll-smooth`}
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
            {children}
          </TemplateProvider>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "FOR Vows",
              url: "https://for-vows.vercel.app",
              description:
                "Wedding creative studio from Frame Of Rangga. Digital invitations, photo & video, content creator, and premium wedding souvenir design.",
              telephone: "+6287779560264",
              email: "frameofrangga@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jakarta",
                addressCountry: "ID",
              },
              sameAs: ["https://instagram.com/frameofrangga"],
              priceRange: "Rp 299.000 - Rp 999.000",
            }),
          }}
        />
      </body>
    </html>
  );
}
