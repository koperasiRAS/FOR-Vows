export type TemplateCategory = "luxury" | "adat" | "modern" | "intimate";

export interface TemplateFeature {
  name: string;
  included: boolean;
}

export interface WeddingTemplate {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
  shortDescription: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  suitableFor: string[];
  features: string[];
  featured: boolean;
  price: string;
  /** Path to thumbnail image (e.g. /images/templates/floral-luxury/thumbnail.jpg). Falls back to gradient placeholder. */
  thumbnailUrl?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  /** Product category — determines which section on /pricing this tier belongs to */
  productType?: "save_the_date" | "invitation" | "website";
}

export interface AddOn {
  name: string;
  description: string;
  price: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  weddingDate: string;
  package: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: TemplateCategory;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  /** Path to thumbnail image. Falls back to /images/templates/[slug]/thumbnail.jpg */
  thumbnailUrl?: string;
  coupleName?: string;
  location?: string;
  date?: string;
  testimonial?: string;
}

export interface ContactFormData {
  fullName: string;
  partnerName: string;
  email: string;
  phone: string;
  weddingDate: string;
  serviceType: string;
  packageName: string;
  templateName: string;
  message: string;
}

export interface InquiryRow {
  id: string;
  full_name: string;
  partner_name: string | null;
  email: string | null;
  phone: string | null;
  wedding_date: string | null;
  service_type: string | null;
  package_name: string | null;
  template_name: string | null;
  message: string | null;
  created_at: string;
}

export interface OrderRow {
  id: string;
  order_code: string;
  // Template & Package
  template_slug?: string | null;
  /** Alias for template_slug — used by admin pages */
  template?: string | null;
  template_name?: string | null;
  package_id?: string | null;
  package_name: string | null;
  // Couple
  groom_name: string;
  bride_name: string;
  // Contact
  phone: string;
  customer_email?: string | null;
  // Wedding Details
  wedding_date?: string | null;
  venue?: string | null;
  venue_address?: string | null;
  couple_story?: string | null;
  // Notes / Story
  notes: string | null;
  // Pricing
  total_amount?: number | null;
  add_ons?: unknown[] | null;
  add_on_total?: number | null;
  items: unknown[] | null;
  total_price: number | null;
  discount_amount: number | null;
  discount_note: string | null;
  final_total: number | null;
  referral_code: string | null;
  // Status
  status: "pending_payment" | "paid" | "processing" | "completed" | "cancelled";
  payment_status?: string | null;
  payment_method?: string | null;
  snap_token?: string | null;
  paid_at: string | null;
  midtrans_order_id: string | null;
  akad_time?: string | null;
  reception_time?: string | null;
  // Timestamps
  created_at: string;
  updated_at?: string | null;
  // Auth
  user_id?: string | null;
}
