-- Auto-generate cover_url from store_link for any game missing a cover image.
-- Extracts the Steam App ID from the store URL and builds the header.jpg CDN link.
-- Run AFTER add_store_link_to_games.sql and games_store_links.sql
-- Run in Supabase SQL editor.

update public.games
set cover_url =
  'https://cdn.cloudflare.steamstatic.com/steam/apps/' ||
  (regexp_match(store_link, 'store\.steampowered\.com/app/(\d+)'))[1] ||
  '/header.jpg'
where
  store_link like '%store.steampowered.com/app/%'
  and (cover_url is null or cover_url = '');
