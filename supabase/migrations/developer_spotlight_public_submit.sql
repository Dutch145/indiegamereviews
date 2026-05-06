-- Allow public (unauthenticated) users to submit games for spotlight consideration.
-- Submissions come in with is_featured = false so they are hidden from the public page.
-- Admins review at /admin/developers and set is_featured = true to approve and publish.
-- Run this in Supabase SQL editor after developer_spotlight.sql

create policy "Public can submit to developer_spotlight"
  on public.developer_spotlight
  for insert
  with check (is_featured = false);
