-- Add user_id to developer_spotlight so submissions can be attributed to accounts
-- Run in Supabase SQL editor

alter table public.developer_spotlight
  add column if not exists user_id uuid references auth.users(id) on delete set null;
