-- Run this in your Supabase SQL editor to create the inquiries table

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  partner_name TEXT,
  email TEXT,
  phone TEXT,
  wedding_date DATE,
  service_type TEXT,
  package_name TEXT,
  template_name TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional for MVP)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon key
CREATE POLICY "Allow anon insert" ON inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only allow service role to read
CREATE POLICY "Allow service role read" ON inquiries
  FOR SELECT TO service_role
  USING (true);
