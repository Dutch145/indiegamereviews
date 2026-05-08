-- Review comments: lets users comment on community reviews
-- Run in Supabase SQL editor

create table public.review_comments (
  id         uuid        primary key default gen_random_uuid(),
  review_id  uuid        not null references public.community_reviews(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  username   text        not null,
  body       text        not null,
  created_at timestamptz not null default now()
);

alter table public.review_comments enable row level security;

create policy "Public can read comments"
  on public.review_comments for select using (true);

create policy "Authenticated users can post comments"
  on public.review_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.review_comments for delete
  using (auth.uid() = user_id);
