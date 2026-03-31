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
                    'paid',
                    'processing',
                    'completed',
                    'cancelled'
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
  payment_status    text,
  paid_at           timestamptz,
  midtrans_order_id text
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

-- Drop first so re-running the full schema is safe (idempotent)
drop policy if exists "Allow anon read" on public.orders;
drop policy if exists "Service role can insert" on public.orders;
drop policy if exists "Service role can update" on public.orders;
drop policy if exists "Users can read own orders" on public.orders;

create policy "Allow anon read" on public.orders for select using (true);

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

-- ─── Inquiries table (contact form submissions) ─────────────────────────────

create table if not exists public.inquiries (
  id              uuid        default gen_random_uuid() primary key,
  full_name       text        not null,
  partner_name    text,
  email           text        not null,
  phone           text,
  wedding_date    text,
  service_type    text,
  package_name    text,
  template_name   text,
  message         text        not null,
  status          text        not null default 'new'
                  check (status in ('new', 'read', 'replied', 'archived')),
  created_at      timestamptz not null default now()
);

-- RLS for inquiries
alter table public.inquiries enable row level security;

-- Drop first (idempotent)
drop policy if exists "Service role can insert inquiries" on public.inquiries;
drop policy if exists "Allow read inquiries" on public.inquiries;
drop policy if exists "Allow update inquiries" on public.inquiries;

-- Service role (server actions) can insert
create policy "Service role can insert inquiries"
  on public.inquiries
  for insert
  with check (true);

-- Allow reads for admin dashboard
create policy "Allow read inquiries"
  on public.inquiries
  for select
  using (true);

-- Allow updates for admin (mark as read/replied)
create policy "Allow update inquiries"
  on public.inquiries
  for update
  using (true)
  with check (true);

-- ─── Customer Auth: user_id on orders ─────────────────────────────────────────

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Index for fast lookup by user_id
create index if not exists orders_user_id_idx on public.orders (user_id);

-- RLS: users can read their own orders via user_id
create policy "Users can read own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

-- ─── Profiles table ───────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  email         text,
  phone         text,
  referral_code text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile row on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS for profiles
alter table public.profiles enable row level security;

-- Drop first (idempotent)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
