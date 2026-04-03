import type {
  Service,
  UndanganDigital,
  WeddingPhotography,
  ContentCreator,
  SouvenirDesign,
} from "@/types/services";
import { formatIDR } from "@/lib/utils";

// ─── LAYANAN 1: Undangan Digital ─────────────────────────────────────────────

export const DIGITAL_INVITATION: UndanganDigital = {
  id: "digital_invitation",
  name: "Undangan Digital",
  tiers: [
    {
      id: "basic",
      label: "Basic",
      price: { min: 99000, max: 149000 },
      tagline: "Solusi hemat & praktis",
      features: [
        { text: "Template pilihan favorit", included: true },
        { text: "RSVP online", included: true },
        { text: "Peta lokasi (Google Maps)", included: true },
        { text: "Musik latar", included: true },
        { text: "Basic edit (nama, tanggal, venue)", included: true },
        { text: "Gallery foto + video", included: false },
        { text: "Love story page", included: false },
        { text: "Amplop digital (QRIS/transfer)", included: false },
        { text: "Custom warna tema", included: false },
        { text: "Unlimited guest", included: false },
        { text: "Free revisi", included: false },
      ],
    },
    {
      id: "premium",
      label: "Premium",
      price: { min: 249000, max: 399000 },
      badge: "Paling Laku",
      tagline: "Paling lengkap untuk momen spesialmu",
      features: [
        { text: "Semua fitur Basic", included: true },
        { text: "Gallery foto + video", included: true },
        { text: "Love story page", included: true },
        { text: "Amplop digital (QRIS/transfer)", included: true },
        { text: "Custom warna tema", included: true },
        { text: "Unlimited guest", included: true },
        { text: "Free revisi", included: true },
        { text: "Custom domain", included: false },
        { text: "Priority support", included: false },
        { text: "Fast delivery 1–2 hari", included: false },
        { text: "Minor custom design", included: false },
      ],
    },
    {
      id: "exclusive",
      label: "Exclusive",
      price: { min: 499000, max: 799000 },
      tagline: "Premium experience, zero compromise",
      features: [
        { text: "Semua fitur Premium", included: true },
        { text: "Custom domain", included: true },
        { text: "Priority support", included: true },
        { text: "Fast delivery 1–2 hari", included: true },
        { text: "Minor custom design", included: true },
        { text: "Full custom UI", included: false },
        { text: "Branding wedding (logo, tema)", included: false },
        { text: "Interactive elements", included: false },
      ],
    },
    {
      id: "custom",
      label: "Custom",
      price: { min: 1000000, max: 3000000, startLabel: "Mulai dari" },
      badge: "High Ticket",
      tagline: "Desain sepenuhnya sesuai visi婚礼-mu",
      features: [
        { text: "Semua fitur Exclusive", included: true },
        { text: "Full custom UI", included: true },
        { text: "Branding wedding (logo, tema)", included: true },
        { text: "Interactive elements", included: true },
        { text: "Cinematic feel", included: true },
      ],
    },
  ],
};

// ─── LAYANAN 2: Foto & Video Wedding ─────────────────────────────────────────

export const WEDDING_PHOTOGRAPHY: WeddingPhotography = {
  id: "wedding_photography",
  name: "Foto & Video Wedding",
  tiers: [
    {
      id: "paket_1",
      label: "Paket 1",
      price: 3350000,
      durationHours: 8,
      photoCount: 150,
      videoIncluded: true,
      videoDuration: "2 menit",
      albumIncluded: true,
      albumDescription: "Album kolase",
      photoPrint: "Photo print + frame 40x60",
      flashDrive: "Flashdisk 16GB",
      cloudStorage: "All file di Flashdisk + Drive",
      crew: "1 fotografer + 1 videografer",
    },
    {
      id: "paket_2",
      label: "Paket 2",
      price: 2500000,
      durationHours: 6,
      photoCount: 100,
      videoIncluded: true,
      videoDuration: "2 menit",
      albumIncluded: true,
      albumDescription: "Album kolase",
      photoPrint: "Photo print 17R",
      flashDrive: "Flashdisk 16GB",
      cloudStorage: "All file di Flashdisk + Drive",
      crew: "1 fotografer + 1 videografer",
    },
    {
      id: "paket_3",
      label: "Paket 3",
      price: 2000000,
      durationHours: 4,
      photoCount: 85,
      videoIncluded: true,
      videoDuration: "2 menit",
      albumIncluded: false,
      photoPrint: undefined,
      flashDrive: "",
      cloudStorage: "All file di Google Drive",
      crew: "1 fotografer + 1 videografer",
    },
    {
      id: "paket_4",
      label: "Paket 4",
      price: 1000000,
      durationHours: 3,
      photoCount: 90,
      videoIncluded: false,
      albumIncluded: false,
      photoPrint: undefined,
      flashDrive: "",
      cloudStorage: "All file di Google Drive",
      crew: "1 fotografer",
    },
  ],
};

// ─── LAYANAN 3: Wedding Content Creator ───────────────────────────────────────

export const CONTENT_CREATOR: ContentCreator = {
  id: "content_creator",
  name: "Wedding Content Creator",
  tiers: [
    {
      id: "silver",
      label: "Silver",
      price: 450000,
      durationHours: 3,
      storyIGRealtime: 3,
      storyIGCuts: 2,
      videoHighlightCount: 1,
      videoHighlightDuration: "max 1 menit, sameday edit",
      videoWeddingTrendCount: 1,
      unlimitedMomentVideo: true,
      cloudDrive: "Google Drive 48 jam",
      onlineMeeting: true,
    },
    {
      id: "gold",
      label: "Gold",
      price: 600000,
      durationHours: 5,
      storyIGRealtime: 5,
      storyIGCuts: 3,
      videoHighlightCount: 2,
      videoHighlightDuration: "max 1 menit, sameday edit",
      videoWeddingTrendCount: 1,
      unlimitedMomentVideo: true,
      cloudDrive: "Google Drive 48 jam",
      onlineMeeting: true,
      badge: "Most Popular",
    },
    {
      id: "platinum",
      label: "Platinum",
      price: 700000,
      durationHours: 8,
      storyIGRealtime: 5,
      storyIGCuts: 4,
      videoHighlightCount: 3,
      videoHighlightDuration: "max 1 menit, sameday edit",
      videoWeddingTrendCount: 2,
      unlimitedMomentVideo: true,
      cloudDrive: "Google Drive 48 jam",
      onlineMeeting: true,
    },
    {
      id: "event",
      label: "Event Package",
      price: 350000,
      durationHours: 3,
      suitableFor: [
        "Engagement",
        "Siraman",
        "Pengajian",
        "Prewedding",
        "Sangjit",
        "Birthday",
        "Graduation",
      ],
      storyIGRealtime: 5,
      storyIGCuts: 0,
      videoHighlightCount: 1,
      videoHighlightDuration: "max 1 menit, sameday edit",
      videoWeddingTrendCount: 0,
      unlimitedMomentVideo: true,
      cloudDrive: "Google Drive 48 jam",
      onlineMeeting: true,
    },
  ],
};

// ─── LAYANAN 4: Desain Souvenir ──────────────────────────────────────────────

export const SOUVENIR_DESIGN: SouvenirDesign = {
  id: "souvenir_design",
  name: "Desain Souvenir",
  products: [
    {
      id: "kipas",
      name: "Custom Kipas",
      includes: [
        "Custom design nama + tanggal",
        "Pilihan tema (minimalist / floral / elegant)",
        "Free 1–2x revisi",
      ],
      priceBreaks: [
        { quantity: 100, pricePerUnit: 28000 },
        { quantity: 200, pricePerUnit: 24000 },
        { quantity: 300, pricePerUnit: 22000 },
        { quantity: 500, pricePerUnit: 20000 },
      ],
    },
    {
      id: "gantungan_kunci",
      name: "Custom Gantungan Kunci",
      includes: [
        "Custom design 1 sisi / 2 sisi basic",
        "Bahan acrylic / hard plastic",
        "Free 1x revisi",
      ],
      priceBreaks: [
        { quantity: 100, pricePerUnit: 18000 },
        { quantity: 200, pricePerUnit: 15000 },
        { quantity: 300, pricePerUnit: 14000 },
        { quantity: 500, pricePerUnit: 12000 },
      ],
    },
    {
      id: "custom_produk",
      name: "Custom Produk Lainnya",
      tagline: "Bebas request produk apapun",
      includes: [
        "Contoh produk: Lilin aromaterapi, Cookies / edible,",
        "Tote bag, Pouch, Diffuser, dan lainnya",
        "Hubungi untuk custom order",
      ],
      priceBreaks: [{ quantity: 0, pricePerUnit: 10000 }],
      contactForCustom: true,
    },
  ],
};

// ─── All Services ─────────────────────────────────────────────────────────────

export const ALL_SERVICES: Service[] = [
  DIGITAL_INVITATION,
  WEDDING_PHOTOGRAPHY,
  CONTENT_CREATOR,
  SOUVENIR_DESIGN,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPriceRange(price: number | { min: number; max: number; startLabel?: string }): string {
  if (typeof price === "number") {
    return formatIDR(price);
  }
  return `${formatIDR(price.min)}–${formatIDR(price.max)}`;
}
