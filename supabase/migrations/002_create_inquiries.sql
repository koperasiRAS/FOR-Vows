-- Migration: Create inquiries table for contact form submissions
-- Run this SQL in Supabase SQL Editor

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

-- RLS
alter table public.inquiries enable row level security;

create policy "Service role can insert inquiries"
  on public.inquiries for insert with check (true);

create policy "Allow read inquiries"
  on public.inquiries for select using (true);

create policy "Allow update inquiries"
  on public.inquiries for update using (true) with check (true);
