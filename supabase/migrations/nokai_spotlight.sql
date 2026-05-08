-- Add Nokai to Developer Spotlight as a featured entry
-- Run in Supabase SQL editor

insert into public.developer_spotlight
  (developer_name, game_title, description, status, store_link, cover_url, is_featured)
values
  (
    'Pretty Potato Games',
    'Nokai',
    'A 1-5 player co-op survival adventure where you rebuild your ship, sail a drowned world and fight toward the rot''s source with crafting, stat-driven combat, skill trees and island-hopping exploration. Upgrade your ship to carry more, travel farther, and survive deeper into hostile waters.',
    'Coming Soon',
    'https://store.steampowered.com/app/1877250/Nokai/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1877250/9c2f0e904e0937ee5cb6ac109ec37e2c4ca6b5da/ss_9c2f0e904e0937ee5cb6ac109ec37e2c4ca6b5da.1920x1080.jpg?t=1778074392',
    true
  );
