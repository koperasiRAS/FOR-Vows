import { FloralLuxuryTemplate } from "@/components/templates/floral-luxury";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TemplateRawPage({ params }: Props) {
  const { slug } = await params;

  // Map slugs to actual template components
  switch (slug) {
    case "floral-luxury":
      return <FloralLuxuryTemplate />;
    // Other templates could be added here later
    // case "eternal-gold":
    //   return <EternalGoldTemplate />;
    default:
      // If the template renderer doesn't exist yet, we can show a placeholder or 404
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
}
