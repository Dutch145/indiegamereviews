-- Add store_link column to games table
-- Run in Supabase SQL editor

alter table public.games
  add column if not exists store_link text;
