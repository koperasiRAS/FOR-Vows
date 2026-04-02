-- Full orders table for FOR Vows
-- Run this in Supabase Dashboard → SQL Editor.
-- ⚠️ WARNING: This drops any existing orders table and recreates it.
-- Existing order data will be LOST. Only run on a new/dev project.

DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                     TEXT UNIQUE NOT NULL,

  -- Template & Package
  template_slug                TEXT,
  template_name                TEXT,
  package_id                   TEXT NOT NULL,
  package_name                 TEXT NOT NULL,

  -- Wedding Details
  bride_name                   TEXT NOT NULL,
  groom_name                  TEXT NOT NULL,
  wedding_date                 DATE,
  venue                        TEXT,
  venue_address                TEXT,
  couple_story                 TEXT,

  -- Contact
  customer_email               TEXT NOT NULL,
  customer_phone               TEXT NOT NULL,

  -- Pricing
  total_amount                 BIGINT NOT NULL,
  add_ons                     JSONB DEFAULT '[]',

  -- Auth (optional — guest checkout works without it)
  user_id                     UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Payment
  status                       TEXT NOT NULL DEFAULT 'pending_payment',
  -- Status: pending_payment | paid | processing | completed | cancelled
  payment_method               TEXT DEFAULT 'pending',
  -- Method: pending | midtrans | transfer_manual
  snap_token                   TEXT,
  midtrans_order_id            TEXT,
  paid_at                      TIMESTAMPTZ,

  -- Metadata
  referral_code                TEXT,
  discount_amount              BIGINT,
  discount_note                TEXT,
  final_total                 BIGINT,

  -- Timestamps
  created_at                   TIMESTAMPTZ DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin/service-role full access (via service role key in server contexts)
CREATE POLICY "Service role full access to orders"
  ON public.orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Anyone can create orders (guest checkout)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS orders_status_idx          ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx   ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_order_id_idx        ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx       ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_user_id_idx          ON public.orders(user_id);
