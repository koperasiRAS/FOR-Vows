-- Run this SQL in your Supabase SQL Editor to create the orders table
-- https://supabase.com/dashboard → your project → SQL Editor

create table if not exists public.orders (
  id              uuid        default gen_random_uuid() primary key,
  order_code      text        not null unique,
  groom_name      text,
  bride_name      text,
  template        text,
  package_name    text,
  phone           text        not null,
  notes           text,
  status          text        not null default 'pending'
                  check (status in (
                    'pending',
                    'waiting_payment',
                    'paid',
                    'in_progress',
                    'revision',
                    'completed'
                  )),
  created_at      timestamptz not null default now(),
  -- Cart-style fields
  items           jsonb,
  total_price     numeric,
  discount_amount numeric,
  discount_note   text,
  final_total     numeric,
  referral_code   text,
  wedding_date    text,
  -- Payment fields
  payment_status  text,
  paid_at         timestamptz
);

-- Auto-generate order_code if not provided
alter table public.orders
  alter column order_code
  set default 'FORV-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 9000 + 1000)::text, 4, '0');

-- Index for fast lookup by order_code
create index if not exists orders_order_code_idx on public.orders (order_code);

-- Index for status filtering
create index if not exists orders_status_idx on public.orders (status);

-- Row Level Security — allow anon reads (for order lookup by code)
alter table public.orders enable row level security;

create policy "Allow anon read"
  on public.orders
  for select
  using (true);

-- Only the service role key (used server-side) can insert — anon/key users cannot insert directly
create policy "Service role can insert"
  on public.orders
  for insert
  with check (auth.role() = 'service_role');

create policy "Service role can update"
  on public.orders
  for update
  using (true)
  with check (true);
