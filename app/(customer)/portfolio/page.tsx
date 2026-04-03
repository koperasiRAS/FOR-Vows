import type { Metadata } from "next";
import { PortfolioPage as PortfolioPageComponent } from "@/components/shared/PortfolioPage";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations, type Language } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Portfolio Karya Kami | FOR Vows — Undangan Digital, Foto, Video & Content Creator",
  description:
    "Portfolio kurasi undangan pernikahan digital, foto & video sinematik, wedding content creator dari FOR Vows. Setiap perayaan diabadikan dengan penuh perhatian.",
  keywords: [
    "portfolio undangan digital",
    "portfolio foto pernikahan",
    "portfolio video wedding",
    "wedding content creator portfolio",
    "karya for vows",
    "contoh undangan digital",
    "hasil foto video pernikahan",
  ],
  openGraph: {
    title: "Portfolio Karya Kami | FOR Vows",
    description: "Undangan digital, foto, video, dan konten pernikahan — semua dari satu studio kreatif.",
    url: "https://for-vows.vercel.app/portfolio",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function PortfolioPage() {
  const lang = await getServerLanguage();
  const t = translations[lang as Language].portfolio;

  return <PortfolioPageComponent t={t} />;
}
