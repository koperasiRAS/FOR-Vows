-- Migration 006: Admin Settings Table
-- Tabel untuk menyimpan pengaturan website FOR Vows secara persisten.
-- Run this in Supabase Dashboard → SQL Editor.

CREATE TABLE IF NOT EXISTS public.settings (
  id               INTEGER PRIMARY KEY DEFAULT 1,  -- single-row table (singleton)
  wa_number        TEXT DEFAULT '',
  email            TEXT DEFAULT '',
  instagram        TEXT DEFAULT '',
  maintenance_mode BOOLEAN DEFAULT false,
  prices           JSONB DEFAULT '{"basic":"299000","premium":"599000","exclusive":"999000"}',
  updated_at       TIMESTAMPTZ DEFAULT NOW(),

  -- Pastikan hanya ada satu baris
  CONSTRAINT settings_singleton CHECK (id = 1)
);

-- Insert default row
INSERT INTO public.settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Hanya bisa dibaca oleh authenticated user (admin)
CREATE POLICY "Authenticated can read settings"
  ON public.settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Hanya service role yang bisa update (via API route server-side)
CREATE POLICY "Service role full access to settings"
  ON public.settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
