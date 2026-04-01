import { Metadata } from "next";
import { getTemplateBySlug } from "@/lib/templates";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return {
      title: "Template Not Found | FOR Vows",
    };
  }

  // Create an engaging Open Graph title for WhatsApp
  const ogTitle = `${template.name} - Premium Wedding Template | FOR Vows`;
  const ogDescription = template.shortDescription;
  const ogImage = `/images/og-default.jpg`; // Placeholder as requested

  return {
    title: `${template.name} | FOR Vows`,
    description: ogDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${template.name} Preview`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default function TemplateLayout({ children }: Props) {
  return <>{children}</>;
}
