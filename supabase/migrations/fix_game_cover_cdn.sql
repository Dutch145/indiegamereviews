-- Fix game cover image URLs: swap Akamai CDN for Cloudflare CDN
-- Akamai blocks cross-origin hotlinking from external sites; Cloudflare does not.
-- Run in Supabase SQL editor.

update public.games
set cover_url = replace(
  cover_url,
  'https://cdn.akamai.steamstatic.com/',
  'https://cdn.cloudflare.steamstatic.com/'
)
where cover_url like 'https://cdn.akamai.steamstatic.com/%';
