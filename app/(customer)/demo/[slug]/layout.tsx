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
      title: "Demo Not Found | FOR Vows",
    };
  }

  const ogTitle = `Live Demo: ${template.name} | FOR Vows`;
  const ogDescription = `Preview the interactive live demo of our ${template.name} wedding template. ${template.shortDescription}`;
  const ogImage = `/images/og-default.jpg`; 

  return {
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${template.name} Live Demo`,
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

export default function DemoLayout({ children }: Props) {
  return <>{children}</>;
}
