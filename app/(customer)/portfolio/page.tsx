import type { Metadata } from "next";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations, type Language } from "@/lib/i18n/translations";
import { getTranslatedPortfolioItems } from "@/lib/templates";
import { PortfolioGrid } from "@/components/shared/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio Karya Kami | FOR Vows",
  description: "Koleksi kurasi undangan pernikahan digital premium yang telah kami buat untuk pasangan-pasangan istimewa. FOR Vows.",
  openGraph: {
    title: "Portfolio Karya Kami | FOR Vows",
    description: "Koleksi kurasi undangan pernikahan digital premium FOR Vows.",
    url: "https://for-vows.vercel.app/portfolio",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function PortfolioPage() {
  const lang = await getServerLanguage();
  const t = translations[lang as Language].portfolio;
  const items = getTranslatedPortfolioItems(lang);

  return (
    <PortfolioGrid
      overline={t.overline}
      title={t.title}
      subtitle={t.subtitle}
      note={t.note}
      ctaOverline={t.ctaOverline}
      ctaTitle={t.ctaTitle}
      ctaSubtitle={t.ctaSubtitle}
      ctaMulaiLabel={t.ctaMulai}
      ctaLihatLabel={t.ctaLihat}
      items={items}
    />
  );
}
