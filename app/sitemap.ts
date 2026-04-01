import { MetadataRoute } from "next";

const TEMPLATE_SLUGS = [
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

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://for-vows.vercel.app";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...TEMPLATE_SLUGS.map((slug) => ({
      url: `${base}/templates/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
