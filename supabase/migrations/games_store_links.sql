-- Populate store_link for all known games
-- Run AFTER add_store_link_to_games.sql
-- Run in Supabase SQL editor

update public.games as g
set store_link = v.link
from (values
  ('hollow-knight',               'https://store.steampowered.com/app/367520/Hollow_Knight/'),
  ('hades',                       'https://store.steampowered.com/app/1145360/Hades/'),
  ('celeste',                     'https://store.steampowered.com/app/504230/Celeste/'),
  ('disco-elysium',               'https://store.steampowered.com/app/632470/Disco_Elysium__The_Final_Cut/'),
  ('stardew-valley',              'https://store.steampowered.com/app/413150/Stardew_Valley/'),
  ('undertale',                   'https://store.steampowered.com/app/391540/Undertale/'),
  ('cuphead',                     'https://store.steampowered.com/app/268910/Cuphead/'),
  ('into-the-breach',             'https://store.steampowered.com/app/590380/Into_the_Breach/'),
  ('return-of-the-obra-dinn',     'https://store.steampowered.com/app/653530/Return_of_the_Obra_Dinn/'),
  ('outer-wilds',                 'https://store.steampowered.com/app/753640/Outer_Wilds/'),
  ('hyper-light-drifter',         'https://store.steampowered.com/app/257850/Hyper_Light_Drifter/'),
  ('transistor',                  'https://store.steampowered.com/app/237930/Transistor/'),
  ('ftl-faster-than-light',       'https://store.steampowered.com/app/212680/FTL_Faster_Than_Light/'),
  ('dead-cells',                  'https://store.steampowered.com/app/588650/Dead_Cells/'),
  ('terraria',                    'https://store.steampowered.com/app/105600/Terraria/'),
  ('the-messenger',               'https://store.steampowered.com/app/764790/The_Messenger/'),
  ('katana-zero',                 'https://store.steampowered.com/app/854950/Katana_ZERO/'),
  ('firewatch',                   'https://store.steampowered.com/app/383870/Firewatch/'),
  ('spiritfarer',                 'https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/'),
  ('ori-and-the-will-of-the-wisps','https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/'),
  ('darkest-dungeon',             'https://store.steampowered.com/app/262060/Darkest_Dungeon/'),
  ('vampire-survivors',           'https://store.steampowered.com/app/1794680/Vampire_Survivors/'),
  ('loop-hero',                   'https://store.steampowered.com/app/1282730/Loop_Hero/'),
  ('monster-sanctuary',           'https://store.steampowered.com/app/814370/Monster_Sanctuary/'),
  ('oxenfree',                    'https://store.steampowered.com/app/388880/Oxenfree/'),
  ('a-short-hike',                'https://store.steampowered.com/app/1055540/A_Short_Hike/'),
  ('risk-of-rain-2',              'https://store.steampowered.com/app/632360/Risk_of_Rain_2/'),
  ('crosscode',                   'https://store.steampowered.com/app/368340/CrossCode/'),
  ('pyre',                        'https://store.steampowered.com/app/462770/Pyre/'),
  ('night-in-the-woods',          'https://store.steampowered.com/app/481510/Night_in_the_Woods/'),
  -- Original catalog games
  ('running-with-rifles',         'https://store.steampowered.com/app/270150/RUNNING_WITH_RIFLES/'),
  ('nine-sols',                   'https://store.steampowered.com/app/1809540/Nine_Sols/'),
  ('content-warning',             'https://store.steampowered.com/app/2881650/Content_Warning/'),
  ('pacific-drive',               'https://store.steampowered.com/app/1458140/Pacific_Drive/'),
  ('manor-lords',                 'https://store.steampowered.com/app/1363080/Manor_Lords/'),
  ('windblown',                   'https://store.steampowered.com/app/1054980/Windblown/'),
  ('crow-country',                'https://store.steampowered.com/app/1996010/Crow_Country/'),
  ('animal-well',                 'https://store.steampowered.com/app/813230/ANIMAL_WELL/'),
  ('balatro',                     'https://store.steampowered.com/app/2379780/Balatro/'),
  ('another-crabs-treasure',      'https://store.steampowered.com/app/1887840/Another_Crabs_Treasure/'),
  ('little-kitty-big-city',       'https://store.steampowered.com/app/1651520/Little_Kitty_Big_City/'),
  ('cassette-beasts',             'https://store.steampowered.com/app/1321440/Cassette_Beasts/'),
  ('dredge',                      'https://store.steampowered.com/app/1421410/DREDGE/')
) as v(slug, link)
where g.slug = v.slug;
