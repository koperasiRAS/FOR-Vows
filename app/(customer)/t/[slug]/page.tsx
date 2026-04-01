import type { Metadata } from "next";
import { FloralLuxuryTemplate } from "@/components/templates/floral-luxury";
import { getTemplateBySlug, getTranslatedTemplate } from "@/lib/templates";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  const translated = getTranslatedTemplate(slug, "id");

  const name = translated?.name ?? template?.name ?? slug;
  const description =
    translated?.shortDescription ?? template?.shortDescription ??
    "Lihat preview interaktif undangan digital pernikahan FOR Vows.";

  return {
    title: `${name} — FOR Vows`,
    description,
    openGraph: {
      title: `${name} | FOR Vows`,
      description,
      images: template ? [`/images/templates/${slug}/hero.jpg`] : [],
    },
  };
}

export default async function TemplateRawPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "floral-luxury") {
    return <FloralLuxuryTemplate />;
  }

  return (
    <div className="flex bg-[#0a0a0a] min-h-screen items-center justify-center text-center p-6">
      <div className="space-y-4">
        <h1 className="text-2xl text-[#c9a96e] font-serif italic">Preview Not Available</h1>
        <p className="text-[#8a8a8a] text-sm">
          The live interactive preview for <strong>{slug}</strong> is currently under development.
        </p>
      </div>
    </div>
  );
}
