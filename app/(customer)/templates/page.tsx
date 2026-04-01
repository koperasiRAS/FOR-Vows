import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TemplateGalleryContent } from "@/components/templates/TemplateGalleryContent";
import { TemplateCardSkeleton } from "@/components/ui/skeleton";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export const revalidate = 3600; // ISR: revalidate every hour

// Stable-keyed skeleton grid — intentionally static, never reordered
function TemplateGridSkeleton() {
  const categories = ["all", "luxury", "adat", "modern", "intimate"] as const;
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <div
            key={cat}
            className="h-8 w-20 rounded-full bg-[#1a1a1a] animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.flatMap((cat) =>
          Array.from({ length: Math.floor(9 / categories.length) }).map(
            (_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <TemplateCardSkeleton key={`${cat}-${i}`} />
            )
          )
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Koleksi Template Undangan | FOR Vows",
  description:
    "Jelajahi 9+ koleksi template undangan pernikahan digital premium. Filter berdasarkan gaya — Luxury, Adat, Modern, atau Intimate. FOR Vows.",
  openGraph: {
    title: "Koleksi Template Undangan | FOR Vows",
    description:
      "Jelajahi 9+ koleksi template undangan pernikahan digital premium.",
    url: "https://for-vows.vercel.app/templates",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function TemplatesPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].pages.templates;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-10">
        <ScrollReveal>
          <SectionHeading
            overline={t.overline}
            title={t.title}
            subtitle={t.subtitle}
          />
        </ScrollReveal>
      </div>

      {/* Gallery — wrapped in Suspense with skeleton fallback */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Suspense fallback={<TemplateGridSkeleton />}>
          <TemplateGalleryContent cols={3} />
        </Suspense>
      </div>
    </div>
  );
}
