import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTemplateBySlug, getRelatedTemplates } from "@/lib/templates";
import { TemplateDetailClient } from "@/components/templates/TemplateDetailClient";

const STATIC_SLUGS = [
  "floral-luxury",
  "eternal-gold",
  "ivory-elegance",
  "nusantara-heritage",
  "javanese-symphony",
  "garden-terrace",
  "minimalist-romance",
  "secret-garden",
  "cozy-celebration",
];

export async function generateStaticParams() {
  return STATIC_SLUGS.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return { title: "Template Not Found | FOR Vows" };

  return {
    title: `${template.name} — Undangan Digital Premium | FOR Vows`,
    description: template.shortDescription,
    openGraph: {
      title: `${template.name} — Undangan Digital Premium | FOR Vows`,
      description: template.shortDescription,
      url: `https://for-vows.vercel.app/templates/${slug}`,
      siteName: "FOR Vows",
      locale: "id_ID",
      type: "website",
    },
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const related = getRelatedTemplates(slug, template.category, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.name,
    description: template.shortDescription,
    url: `https://for-vows.vercel.app/templates/${slug}`,
    brand: { "@type": "Brand", name: "FOR Vows" },
    offers: {
      "@type": "Offer",
      price: template.category === "luxury" ? "599000" : template.category === "adat" ? "599000" : "299000",
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TemplateDetailClient slug={slug} template={template} related={related} />
    </>
  );
}
