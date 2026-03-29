"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateFilter } from "@/components/templates/TemplateFilter";
import { templates } from "@/lib/templates";
import { useLanguage } from "@/lib/i18n/context";
import type { TemplateCategory } from "@/types";

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  const { t } = useLanguage();

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-10">
        <ScrollReveal>
          <SectionHeading
            overline={t("pages.templates.overline")}
            title={t("pages.templates.title")}
            subtitle={t("pages.templates.subtitle")}
          />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-10">
            <TemplateFilter active={activeCategory} onChange={setActiveCategory} />
          </div>
        </ScrollReveal>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((template, i) => (
            <ScrollReveal key={template.id} delay={i * 60}>
              <TemplateCard template={template} />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6a6a6a] text-sm">
              {t("pages.templates.noResults")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
