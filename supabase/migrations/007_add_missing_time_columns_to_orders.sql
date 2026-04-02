-- Migration 007: Add missing time columns to orders table
-- This migration fixes an issue where the checkout process fails to save
-- the order because the backend attempts to insert `akad_time` and `reception_time`
-- into the orders table, but those columns did not exist.

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS akad_time TEXT,
ADD COLUMN IF NOT EXISTS reception_time TEXT;
