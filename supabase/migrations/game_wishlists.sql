-- Game wishlist: lets users save/bookmark games
-- Run in Supabase SQL editor

create table public.game_wishlists (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  game_id    uuid        not null references public.games(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, game_id)
);

alter table public.game_wishlists enable row level security;

create policy "Users can manage their own wishlists"
  on public.game_wishlists for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public can view wishlist counts"
  on public.game_wishlists for select
  using (true);
