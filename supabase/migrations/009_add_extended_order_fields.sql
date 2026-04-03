-- Migration 009: Add extended order fields for multi-category support
-- Run this in Supabase Dashboard → SQL Editor.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS service_category  TEXT    DEFAULT 'undangan' NOT NULL,
  ADD COLUMN IF NOT EXISTS service_details   JSONB   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS template_slug     TEXT,
  ADD COLUMN IF NOT EXISTS template_name     TEXT,
  ADD COLUMN IF NOT EXISTS package_id        TEXT,
  ADD COLUMN IF NOT EXISTS customer_email    TEXT,
  ADD COLUMN IF NOT EXISTS venue             TEXT,
  ADD COLUMN IF NOT EXISTS venue_address     TEXT,
  ADD COLUMN IF NOT EXISTS couple_story      TEXT,
  ADD COLUMN IF NOT EXISTS total_amount      NUMERIC,
  ADD COLUMN IF NOT EXISTS add_on_total      NUMERIC,
  ADD COLUMN IF NOT EXISTS payment_method    TEXT,
  ADD COLUMN IF NOT EXISTS updated_at        TIMESTAMPTZ DEFAULT now();

-- Backfill service_category for old rows
UPDATE public.orders
  SET service_category = 'undangan'
  WHERE service_category IS NULL OR service_category = '';

COMMENT ON COLUMN public.orders.service_category IS 'undangan | foto | content | souvenir';
COMMENT ON COLUMN public.orders.service_details  IS 'Category-specific JSONB fields (e.g., event_type, ig_username, quantity, souvenir_name)';
