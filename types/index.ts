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
