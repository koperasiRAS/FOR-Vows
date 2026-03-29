"use server";

import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import type { ContactFormData } from "@/types";

export async function submitInquiry(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  // Validate required fields
  if (!data.fullName?.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: "A valid email address is required." };
  }
  if (!data.message?.trim()) {
    return { success: false, error: "Please include a message." };
  }

  try {
    const supabase = await createSupabaseServer();

    const { error } = await supabase.from("inquiries").insert({
      full_name: data.fullName.trim(),
      partner_name: data.partnerName?.trim() || null,
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      wedding_date: data.weddingDate || null,
      service_type: data.serviceType || null,
      package_name: data.packageName || null,
      template_name: data.templateName?.trim() || null,
      message: data.message.trim(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Failed to submit inquiry. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Server action error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
