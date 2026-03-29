import { Metadata } from "next";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLanguage();
  const t = translations[lang].pages.privacy;
  return {
    title: t.title,
    description: t.description,
  };
}

export default async function PrivacyPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].pages.privacy;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
            {t.effectiveDateLabel}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] mb-4">
            {t.title}
          </h1>
          <p className="text-[#9a9a9a] text-sm leading-relaxed">
            {t.lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {t.sections.map((section, i) => (
            <div key={i} className="space-y-3">
              <h2 className="font-serif text-xl text-[#faf8f5] border-b border-white/[0.08] pb-2">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.content.map((para, j) => (
                  <p key={j} className="text-[#9a9a9a] text-sm leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5">
          <p className="text-xs text-[#c9a96e] text-center leading-relaxed">
            {t.footerNote}
          </p>
        </div>
      </div>
    </div>
  );
}
