import type {
  WeddingTemplate,
  PricingTier,
  AddOn,
  FeatureItem,
  TestimonialItem,
  HowItWorksStep,
  PortfolioItem,
} from "@/types";

export const templates: WeddingTemplate[] = [
  {
    id: "1",
    slug: "eternal-gold",
    name: "Eternal Gold",
    category: "luxury",
    description:
      "A grand, opulent invitation inspired by the warmth of gilded palaces. Deep gold gradients meet rich charcoal backgrounds, accented with fine ornamental details that evoke timeless celebration.",
    shortDescription: "Opulent luxury with gilded accents and palace-inspired elegance.",
    gradientFrom: "#1a1206",
    gradientTo: "#3d2e0f",
    accentColor: "#c9a96e",
    suitableFor: ["Grand weddings", "Hotel ballrooms", "Black-tie events"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Digital gift envelope",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Guest wishes",
      "Google Maps integration",
      "Multiple events",
    ],
    featured: true,
    price: "Rp 599.000",
  },
  {
    id: "2",
    slug: "ivory-elegance",
    name: "Ivory Elegance",
    category: "luxury",
    description:
      "Clean, refined, and breathtakingly sophisticated. An ivory-forward palette with subtle champagne and gold detailing — perfect for the modern couple who believes elegance speaks in whispers.",
    shortDescription: "Refined ivory tones with whisper-light gold detailing.",
    gradientFrom: "#f5f0e8",
    gradientTo: "#e8e0d0",
    accentColor: "#c9a96e",
    suitableFor: ["Garden venues", "Beachfront ceremonies", "Minimalist celebrations"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Google Maps integration",
      "Multiple events",
    ],
    featured: true,
    price: "Rp 599.000",
  },
  {
    id: "3",
    slug: "nusantera-heritage",
    name: "Nusantara Heritage",
    category: "adat",
    description:
      "Rooted in the rich visual language of the Indonesian archipelago. Batik-inspired motifs, warm earthy tones, and traditional ornamental borders come together in a digital invitation that honors culture.",
    shortDescription: "Batik-inspired motifs honoring the beauty of Indonesian tradition.",
    gradientFrom: "#2d1810",
    gradientTo: "#5c2e1a",
    accentColor: "#d4a96e",
    suitableFor: ["Traditional ceremonies", "Heritage venues", "Cultural celebrations"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Guest wishes",
      "Google Maps integration",
    ],
    featured: true,
    price: "Rp 299.000",
  },
  {
    id: "4",
    slug: "javanese-symphony",
    name: "Javanese Symphony",
    category: "adat",
    description:
      "Inspired by the graceful art of Java's royal courts. This invitation carries the elegance of Javanese heritage — wayang-inspired accents, refined gold lines, and a palette drawn from temple stone and candlelight.",
    shortDescription: "Javanese royal court elegance with temple-stone tones.",
    gradientFrom: "#1e1508",
    gradientTo: "#3a2810",
    accentColor: "#b8944a",
    suitableFor: ["Royal-themed weddings", "Kraton-inspired venues", "Cultural ceremonies"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Digital gift envelope",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Guest wishes",
      "Google Maps integration",
      "Multiple events",
    ],
    featured: false,
    price: "Rp 599.000",
  },
  {
    id: "5",
    slug: "garden-terrace",
    name: "Garden Terrace",
    category: "modern",
    description:
      "A fresh, contemporary invitation that breathes with natural light. Soft sage greens, warm neutrals, and botanical line art create a garden-inspired digital experience that feels alive and joyful.",
    shortDescription: "Botanical freshness with contemporary grace.",
    gradientFrom: "#1a2e1a",
    gradientTo: "#2d4a28",
    accentColor: "#8fbc8f",
    suitableFor: ["Outdoor gardens", "Botanical venues", "Spring & summer weddings"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Google Maps integration",
    ],
    featured: false,
    price: "Rp 299.000",
  },
  {
    id: "6",
    slug: "minimalist-romance",
    name: "Minimalist Romance",
    category: "modern",
    description:
      "When less becomes everything. Pure typography, generous white space, and a single accent color create an invitation that lets your love story take center stage — understated, intentional, and deeply personal.",
    shortDescription: "Pure typography and white space celebrating understated love.",
    gradientFrom: "#f8f6f3",
    gradientTo: "#efe9e1",
    accentColor: "#b89a6e",
    suitableFor: ["Urban venues", "Loft spaces", "Contemporary art galleries"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Photo gallery",
      "Background music",
      "Google Maps integration",
    ],
    featured: false,
    price: "Rp 299.000",
  },
  {
    id: "7",
    slug: "secret-garden",
    name: "Secret Garden",
    category: "intimate",
    description:
      "An intimate, candlelit atmosphere captured in digital form. Deep burgundy tones, soft florals, and warm amber lighting create an invitation that feels like a whispered invitation to something sacred and private.",
    shortDescription: "Candlelit intimacy with deep burgundy warmth.",
    gradientFrom: "#1e0a12",
    gradientTo: "#3a1422",
    accentColor: "#c97878",
    suitableFor: ["Intimate ceremonies", "Private estates", "Evening celebrations"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Digital gift envelope",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Guest wishes",
      "Google Maps integration",
    ],
    featured: true,
    price: "Rp 599.000",
  },
  {
    id: "8",
    slug: "cozy-celebration",
    name: "Cozy Celebration",
    category: "intimate",
    description:
      "Warm, inviting, and full of heart. Soft peach and blush tones blend with gentle cream backgrounds to create a digital invitation that wraps your guests in the warmth of your celebration.",
    shortDescription: "Soft blush warmth for an intimate gathering of hearts.",
    gradientFrom: "#2e1a18",
    gradientTo: "#4a2822",
    accentColor: "#c9a07a",
    suitableFor: ["Small gatherings", "Home celebrations", "Family events"],
    features: [
      "Personalized guest name",
      "RSVP management",
      "Wedding countdown",
      "Photo gallery",
      "Background music",
      "Google Maps integration",
    ],
    featured: false,
    price: "Rp 299.000",
  },
];

export const getTemplateBySlug = (slug: string): WeddingTemplate | undefined => {
  return templates.find((t) => t.slug === slug);
};

export const getRelatedTemplates = (
  slug: string,
  category: string,
  limit = 3
): WeddingTemplate[] => {
  return templates
    .filter((t) => t.slug !== slug && t.category === category)
    .slice(0, limit);
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: "Rp 299.000",
    description:
      "Everything you need for a beautiful, functional digital wedding invitation.",
    features: [
      "1 wedding invitation template",
      "Personalized guest name",
      "RSVP management",
      "Photo gallery (up to 20 photos)",
      "Wedding countdown",
      "Background music",
      "Google Maps integration",
      "Mobile-optimized design",
      "WhatsApp share link",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "Rp 599.000",
    description:
      "The most popular choice for couples who want a truly memorable digital experience.",
    features: [
      "1 premium invitation template",
      "Personalized guest name",
      "RSVP management",
      "Digital gift envelope (QR)",
      "Wedding countdown",
      "Photo gallery (up to 50 photos)",
      "Background music with controls",
      "Guest wishes & messages",
      "Google Maps integration",
      "Multiple events support",
      "Live streaming link",
      "Priority support",
      "Custom color accents",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Exclusive",
    price: "Rp 999.000",
    description:
      "Bespoke digital invitation with full customization and dedicated creative direction.",
    features: [
      "Custom-designed template",
      "Full brand identity matching",
      "Personalized guest name",
      "RSVP management",
      "Digital gift envelope (QR)",
      "Wedding countdown",
      "Photo gallery (unlimited)",
      "Background music with controls",
      "Guest wishes & messages",
      "Google Maps integration",
      "Multiple events support",
      "Live streaming link",
      "Premium animation effects",
      "Custom domain (1 year)",
      "Fast-track delivery (48h)",
      "Unlimited revisions",
      "Dedicated creative director",
    ],
    highlighted: false,
    badge: "Bespoke",
  },
];

export const addOns: AddOn[] = [
  { name: "Custom Domain", description: "Your own domain for the invitation page", price: "Rp 150.000/yr" },
  { name: "Fast Track", description: "48-hour delivery instead of standard 5-7 days", price: "Rp 100.000" },
  { name: "Premium Animation", description: "Elegant entrance and transition animations", price: "Rp 75.000" },
  { name: "Extra Gallery", description: "Additional 50 photos beyond package limit", price: "Rp 50.000" },
  { name: "Digital Gift QR", description: "QR code linking to bank account or e-wallet", price: "Rp 25.000" },
  { name: "Custom Guest Link", description: "Unique short link for each guest or family", price: "Rp 50.000" },
];

export const features: FeatureItem[] = [
  {
    icon: "Heart",
    title: "Personalized Guest Name",
    description: "Each invitation addresses your guest by name, creating an intimate and thoughtful experience from the first touch.",
  },
  {
    icon: "ClipboardCheck",
    title: "Smart RSVP",
    description: "Streamlined RSVP management with dietary preferences, attendance counts, and instant guest list updates.",
  },
  {
    icon: "Gift",
    title: "Digital Gift Envelope",
    description: "Elegant digital gift box with QR code linking to your bank account or preferred e-wallet.",
  },
  {
    icon: "Clock",
    title: "Wedding Countdown",
    description: "A beautiful live countdown timer building anticipation from the moment your guests open the invitation.",
  },
  {
    icon: "BookOpen",
    title: "Wedding Story",
    description: "Share your love story timeline — from first meeting to the proposal — beautifully presented.",
  },
  {
    icon: "Images",
    title: "Photo Gallery",
    description: "Curated photo galleries showcasing your journey together, with elegant lightbox viewing.",
  },
  {
    icon: "MapPin",
    title: "Maps Integration",
    description: "Interactive Google Maps with venue directions, parking information, and venue photos.",
  },
  {
    icon: "Music",
    title: "Background Music",
    description: "Carefully selected ambient music that sets the emotional tone for your invitation.",
  },
  {
    icon: "MessageCircle",
    title: "Guest Wishes",
    description: "A dedicated space for guests to leave heartfelt messages and well-wishes for your union.",
  },
  {
    icon: "CalendarDays",
    title: "Multiple Events",
    description: "Support for akad, ceremony, reception, and other events with individual schedules and venues.",
  },
  {
    icon: "Video",
    title: "Live Streaming",
    description: "Integrated live streaming link for guests who cannot attend in person.",
  },
  {
    icon: "Smartphone",
    title: "Mobile Optimized",
    description: "Flawlessly designed for every screen — from the smallest phone to the largest desktop.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote: "FOR Vows transformed our invitation into a work of art. Our guests were genuinely moved — several said it was the most beautiful wedding invitation they had ever received.",
    name: "Anisa & Rizky",
    weddingDate: "December 2025",
    package: "Premium — Eternal Gold",
  },
  {
    quote: "The RSVP management alone saved us weeks of follow-up calls. Everything was organized, elegant, and effortless. Worth every rupiah.",
    name: "Dewi & Fachry",
    weddingDate: "October 2025",
    package: "Premium — Ivory Elegance",
  },
  {
    quote: "As a couple who wanted something deeply personal, the Exclusive package delivered beyond our imagination. The team's creative direction was impeccable.",
    name: "Sarah & Michael",
    weddingDate: "January 2026",
    package: "Exclusive",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: "01",
    title: "Choose Your Template",
    description:
      "Browse our curated collection of premium invitation templates. Filter by style — Luxury, Adat, Modern, or Intimate — and find the one that speaks to your love story.",
    icon: "Sparkles",
  },
  {
    number: "02",
    title: "Submit Your Details",
    description:
      "Fill out our elegant brief form with your wedding information — names, dates, venues, story, and photos. Our team handles the rest with care and precision.",
    icon: "PenLine",
  },
  {
    number: "03",
    title: "Review & Approve",
    description:
      "Receive your personalized draft within 5–7 business days. Request revisions until every detail is exactly as you envisioned. We refine until it's perfect.",
    icon: "Eye",
  },
  {
    number: "04",
    title: "Make Payment",
    description:
      "Once you're delighted with the result, complete your secure payment. We offer flexible installment options for the Exclusive package.",
    icon: "CreditCard",
  },
  {
    number: "05",
    title: "Publish & Share",
    description:
      "Your digital invitation goes live. Receive your unique URL and WhatsApp share link. Watch the RSVPs roll in as your guests share in your joy.",
    icon: "Share2",
  },
];

export const portfolioItems: PortfolioItem[] = [
  { id: "1", title: "Eternal Gold", category: "luxury", gradientFrom: "#1a1206", gradientTo: "#3d2e0f", description: "Grand ballroom wedding, Jakarta" },
  { id: "2", title: "Nusantara Heritage", category: "adat", gradientFrom: "#2d1810", gradientTo: "#5c2e1a", description: "Traditional ceremony, Yogyakarta" },
  { id: "3", title: "Secret Garden", category: "intimate", gradientFrom: "#1e0a12", gradientTo: "#3a1422", description: "Private estate, Bali" },
  { id: "4", title: "Garden Terrace", category: "modern", gradientFrom: "#1a2e1a", gradientTo: "#2d4a28", description: "Botanical garden, Bandung" },
  { id: "5", title: "Ivory Elegance", category: "luxury", gradientFrom: "#f5f0e8", gradientTo: "#e8e0d0", description: "Beachfront resort, Lombok" },
  { id: "6", title: "Javanese Symphony", category: "adat", gradientFrom: "#1e1508", gradientTo: "#3a2810", description: "Kraton-inspired venue, Solo" },
  { id: "7", title: "Cozy Celebration", category: "intimate", gradientFrom: "#2e1a18", gradientTo: "#4a2822", description: "Home garden, Surabaya" },
  { id: "8", title: "Minimalist Romance", category: "modern", gradientFrom: "#f8f6f3", gradientTo: "#efe9e1", description: "Urban loft, Jakarta" },
];
