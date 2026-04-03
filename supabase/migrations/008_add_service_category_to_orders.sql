-- Adds service_category and service_details to support multi-category orders
-- Run this in Supabase Dashboard → SQL Editor.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS service_category TEXT DEFAULT 'undangan' NOT NULL,
  ADD COLUMN IF NOT EXISTS service_details  JSONB DEFAULT '{}';

-- Backfill existing orders as 'undangan'
UPDATE public.orders
  SET service_category = 'undangan',
      service_details  = '{}'
  WHERE service_category IS NULL;

COMMENT ON COLUMN public.orders.service_category IS 'undangan | foto | content | souvenir';
COMMENT ON COLUMN public.orders.service_details  IS 'Category-specific fields: event_type, ig_username, product_id, quantity, souvenir_names, theme_color, etc.';
