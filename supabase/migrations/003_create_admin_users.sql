-- Creates the admin_users table for managing authorized admin accounts.
-- Run this in Supabase Dashboard → SQL Editor.
-- IMPORTANT: Replace 'EMAIL_ADMIN_KAMU@gmail.com' with your actual admin email before running.

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: only accessible via service role key in server-side contexts (middleware)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can read admin_users" ON public.admin_users FOR
SELECT USING (true);

-- Insert your admin email here
INSERT INTO
    public.admin_users (email, role)
VALUES (
        'frameofrangga@gmail.com',
        'admin'
    ) ON CONFLICT (email) DO NOTHING;