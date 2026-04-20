-- ============================================================
-- Admin Role Setup
-- Run this in your Supabase SQL Editor AFTER schema.sql
-- ============================================================


-- ============================================================
-- Add is_admin flag to profiles
-- ============================================================

alter table public.profiles add column if not exists is_admin boolean default false not null;


-- ============================================================
-- Admin helper function (used in RLS policies)
-- ============================================================

create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;


-- ============================================================
-- Grant admins full write access to games
-- ============================================================

create policy "Admins can insert games"
  on public.games for insert
  with check (public.is_admin());

create policy "Admins can update games"
  on public.games for update
  using (public.is_admin());

create policy "Admins can delete games"
  on public.games for delete
  using (public.is_admin());


-- ============================================================
-- Grant admins full write access to editor_reviews
-- ============================================================

create policy "Admins can insert editor reviews"
  on public.editor_reviews for insert
  with check (public.is_admin());

create policy "Admins can update editor reviews"
  on public.editor_reviews for update
  using (public.is_admin());

create policy "Admins can delete editor reviews"
  on public.editor_reviews for delete
  using (public.is_admin());


-- ============================================================
-- Grant admins delete access to community_reviews
-- ============================================================

create policy "Admins can delete any community review"
  on public.community_reviews for delete
  using (public.is_admin());


-- ============================================================
-- Flagged reviews table
-- ============================================================

create table if not exists public.flagged_reviews (
  id          uuid primary key default uuid_generate_v4(),
  review_id   uuid not null references public.community_reviews(id) on delete cascade,
  flagged_by  uuid not null references public.profiles(id) on delete cascade,
  reason      text,
  resolved    boolean default false not null,
  created_at  timestamptz default now() not null,
  unique (review_id, flagged_by)
);

alter table public.flagged_reviews enable row level security;

create policy "Admins can view all flags"
  on public.flagged_reviews for select
  using (public.is_admin());

create policy "Authenticated users can flag a review"
  on public.flagged_reviews for insert
  with check (auth.uid() = flagged_by);

create policy "Admins can resolve flags"
  on public.flagged_reviews for update
  using (public.is_admin());


-- ============================================================
-- Make yourself an admin
-- Replace the email below with your own account's email
-- ============================================================

-- update public.profiles
-- set is_admin = true
-- where id = (select id from auth.users where email = 'you@example.com');
