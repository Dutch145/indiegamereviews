-- Developer Spotlight table
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table public.developer_spotlight (
  id               uuid        primary key default gen_random_uuid(),
  developer_name   text        not null,
  game_title       text        not null,
  description      text,
  status           text,        -- "In Development" | "Coming Soon" | "Early Access" | "Released"
  twitter_handle   text,
  twitter_post_url text,
  store_link       text,
  cover_url        text,
  is_featured      boolean     not null default false,
  created_at       timestamptz not null default now()
);

alter table public.developer_spotlight enable row level security;

-- Public can read
create policy "Public can read developer_spotlight"
  on public.developer_spotlight
  for select
  using (true);

-- Admins can insert
create policy "Admins can insert developer_spotlight"
  on public.developer_spotlight
  for insert
  with check (public.is_admin());

-- Admins can update
create policy "Admins can update developer_spotlight"
  on public.developer_spotlight
  for update
  using (public.is_admin());

-- Admins can delete
create policy "Admins can delete developer_spotlight"
  on public.developer_spotlight
  for delete
  using (public.is_admin());
