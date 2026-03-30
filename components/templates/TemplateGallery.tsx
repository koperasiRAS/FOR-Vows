"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateFilter } from "@/components/templates/TemplateFilter";
import { useSelectedTemplate } from "@/lib/template-context";
import { templates } from "@/lib/templates";
import { useLanguage } from "@/lib/i18n/context";
import type { TemplateCategory } from "@/types";

interface TemplateGalleryProps {
  /** Number of columns: default 3 (lg: 3-col grid) */
  cols?: 2 | 3;
}

export function TemplateGallery({ cols = 3 }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  const { selectTemplate } = useSelectedTemplate();
  const router = useRouter();
  const { t } = useLanguage();

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const handleSelectTemplate = (template: (typeof templates)[number]) => {
    selectTemplate(template);
    router.push(`/templates/${template.slug}`);
  };

  const gridCols = cols === 2
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {/* Filter */}
      <div className="mb-8">
        <TemplateFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Grid */}
      <div className={`grid ${gridCols} gap-6`}>
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className="block w-full text-left cursor-pointer"
          >
            <TemplateCard template={template} />
          </button>
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
  );
}
