// ─── Shared Primitives ──────────────────────────────────────────────────────

export type PriceRange = {
  min: number;
  max: number;
  startLabel?: string; // e.g. "Mulai dari"
};

export type PriceValue = number | PriceRange;

export type ServiceBadge = "Paling Laku" | "High Ticket" | "Most Popular";

export type FeatureItem = {
  text: string;
  included: boolean;
};

// ─── Undangan Digital ───────────────────────────────────────────────────────

export type UndanganTier = "basic" | "premium" | "exclusive" | "custom";

export type UndanganDigital = {
  id: "digital_invitation";
  name: string;
  tiers: UndanganDigitalTier[];
};

export type UndanganDigitalTier = {
  id: UndanganTier;
  label: string;
  price: PriceRange;
  badge?: ServiceBadge;
  tagline?: string;
  features: FeatureItem[];
};

// ─── Foto & Video Wedding ───────────────────────────────────────────────────

export type WeddingPhotographyTier = "paket_1" | "paket_2" | "paket_3" | "paket_4";

export type WeddingPhotography = {
  id: "wedding_photography";
  name: string;
  tiers: WeddingPhotographyTierItem[];
};

export type WeddingPhotographyTierItem = {
  id: WeddingPhotographyTier;
  label: string;
  price: number;
  durationHours: number;
  photoCount: number;
  videoIncluded: boolean;
  videoDuration?: string; // e.g. "2 menit"
  albumIncluded: boolean;
  albumDescription?: string;
  photoPrint?: string;
  flashDrive: string;
  cloudStorage: string;
  crew: string;
};

// ─── Wedding Content Creator ────────────────────────────────────────────────

export type ContentCreatorTier = "silver" | "gold" | "platinum" | "event";

export type ContentCreator = {
  id: "content_creator";
  name: string;
  tiers: ContentCreatorTierItem[];
};

export type ContentCreatorTierItem = {
  id: ContentCreatorTier;
  label: string;
  price: number;
  durationHours: number;
  suitableFor?: string[];
  storyIGRealtime: number;
  storyIGCuts: number;
  videoHighlightCount: number;
  videoHighlightDuration?: string;
  videoWeddingTrendCount: number;
  unlimitedMomentVideo: boolean;
  cloudDrive: string;
  onlineMeeting: boolean;
  badge?: ServiceBadge;
};

// ─── Desain Souvenir ────────────────────────────────────────────────────────

export type SouvenirProductId =
  | "kipas"
  | "gantungan_kunci"
  | "custom_produk";

export type SouvenirPriceBreak = {
  quantity: number;
  pricePerUnit: number;
};

export type SouvenirProduct = {
  id: SouvenirProductId;
  name: string;
  tagline?: string;
  priceBreaks: SouvenirPriceBreak[];
  includes: string[];
  contactForCustom?: boolean;
};

export type SouvenirDesign = {
  id: "souvenir_design";
  name: string;
  products: SouvenirProduct[];
};

// ─── Union Type ─────────────────────────────────────────────────────────────

export type Service =
  | UndanganDigital
  | WeddingPhotography
  | ContentCreator
  | SouvenirDesign;
