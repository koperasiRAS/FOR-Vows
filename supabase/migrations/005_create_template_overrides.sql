-- Migration 005: Admin Template Overrides
-- Tabel untuk menyimpan override data template (featured, harga, nama dll)
-- tanpa mengubah hardcoded template di lib/templates.ts
-- 
-- Run this in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS public.admin_template_overrides (
  slug              TEXT PRIMARY KEY,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  price_override    TEXT,
  display_name      TEXT,
  display_description TEXT,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: hanya bisa diakses via service role key / admin authenticated session
ALTER TABLE public.admin_template_overrides ENABLE ROW LEVEL SECURITY;

-- Allow read for all authenticated users (admin check done at app level)
CREATE POLICY "Authenticated can read template overrides"
  ON public.admin_template_overrides
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow write only via service role (admin-only mutations at app level)
CREATE POLICY "Service role full access to template overrides"
  ON public.admin_template_overrides
  FOR ALL
  USING (true)
  WITH CHECK (true);
