import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

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

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <TemplateGallery cols={3} />
      </div>
    </div>
  );
}
