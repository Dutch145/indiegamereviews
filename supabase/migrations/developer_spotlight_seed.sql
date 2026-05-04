-- Developer Spotlight seed data
-- Run this in the Supabase SQL editor AFTER running developer_spotlight.sql
-- All 9 entries are marked as featured

insert into public.developer_spotlight
  (developer_name, game_title, description, status, twitter_handle, twitter_post_url, store_link, cover_url, is_featured)
values
  (
    'Space Raccoon Games',
    'A Game About Chopping Trees',
    'Grab your axe, hop on the handcar, and lose yourself in the forest. Chop trees, upgrade your gear, and enjoy the ride — alone or with a friend',
    'In Development',
    '@raccoon_ltd',
    'https://x.com/raccoon_ltd/status/2042286420572737976',
    'https://store.steampowered.com/app/4512570/A_Game_About_Chopping_Trees/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4512570/07a076f9b432e6d1d08f6771d4549e2dddd6ae08/ss_07a076f9b432e6d1d08f6771d4549e2dddd6ae08.1920x1080.jpg?t=1777759138',
    true
  ),
  (
    'Bonobo Software',
    'Taival',
    'Play together on the couch or online - or both at once. Taival is a cozy co-op adventure where you and up to 3 friends explore a handcrafted world alongside your shapeshifting companion. Discover new forms, progress through narrative quests, and make the journey your own.',
    'Coming Soon',
    '@TaivalGame',
    'https://x.com/TaivalGame/status/2046860585342845139',
    'https://store.steampowered.com/app/3152750/Taival/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3152750/ss_6376139872f9e2fd26e4596b47b253b02953384f.1920x1080.jpg?t=1777477279',
    true
  ),
  (
    'MEWSTURBO',
    'Pet the Cat',
    'Pet the Cat is a bullet-hell shooter where you unleash powerful attacks by petting an adorable cat! Fight through endless waves of enemies and upgrade your kitty into a formidable force with food, items, and weapons.',
    'Coming Soon',
    '@BYETOM2',
    'https://x.com/BYETOM2/status/2051017083128107050',
    'https://store.steampowered.com/app/4605210/Pet_the_Cat/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4605210/1a1a16de1d77a64a5e547185ced8ae9f3fb0bddd/ss_1a1a16de1d77a64a5e547185ced8ae9f3fb0bddd.1920x1080.jpg?t=1776743405',
    true
  ),
  (
    'Sköll Studio',
    'Last Moon',
    'Last Moon is an action RPG which embraces the vibes of classic titles from the 90s. Explore a mesmerising, vast, ruined world riddled with dangers, face tainted creatures and upgrade your abilities to regain peace. The Moon is falling. Will you bring harmony back to the world?',
    'Coming Soon',
    '@LastMoonGame',
    'https://x.com/LastMoonGame/status/2050529460374339710',
    'https://store.steampowered.com/app/1108600/Last_Moon/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1108600/ss_70dc5bc535133a64127c58f71ebc048fd2f17a46.1920x1080.jpg?t=1764456629',
    true
  ),
  (
    'Dillon Steyl',
    'Blood Vial',
    'BLOOD VIAL is a retro-inspired micro-FPS with a leaking health bar. Swim through the spilled blood of your fallen enemies to keep your vial full. Grow increasingly powerful with new upgrades and weapons. Navigate an ever-shifting labyrinth of crypts, catacombs and cathedrals.',
    'Coming Soon',
    '@DillonSteyl',
    'https://x.com/DillonSteyl/status/2050469769225416982',
    'https://store.steampowered.com/app/3648730/Blood_Vial/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3648730/6fd08834d86615756aa9208c875cf6708627a549/ss_6fd08834d86615756aa9208c875cf6708627a549.1920x1080.jpg?t=1777643406',
    true
  ),
  (
    'Baikun Interactive',
    'SpiritVale',
    'A class-based action MMO inspired by classic RPGs. Explore a fractured world of monsters and ruins, build your own playstyle, and fight alongside friends in real-time, cooperative combat.',
    'In Development',
    '@SpiritValeGame',
    'https://x.com/SpiritValeGame/status/2050979498686914868',
    'https://store.steampowered.com/app/3767850/SpiritVale/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3767850/1428ba784152faefa7b158e96970432c2d09b47c/ss_1428ba784152faefa7b158e96970432c2d09b47c.1920x1080.jpg?t=1774876215',
    true
  ),
  (
    'NJJ',
    'Clatter Throne',
    'Your dice are alive! Recruit heroes, arm them with spells one side at a time, roll, and fight for the Clatter Throne in this tabletop roguelike autobattler.',
    'In Development',
    '@ClatterThrone',
    'https://x.com/ClatterThrone/status/2046967765634781572',
    'https://store.steampowered.com/app/4320990/Clatter_Throne/',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4320990/2e039dec326f44fd1ed619ccc5ce0fd1a4c61cd7/ss_2e039dec326f44fd1ed619ccc5ce0fd1a4c61cd7.1920x1080.jpg?t=1776686911',
    true
  ),
  (
    'Long Lost',
    'Tidespawn',
    'Tidespawn is an underwater fantasy action-adventure RPG. Explore ancient ruins, vibrant reefs, and sunken caverns in a retro-inspired pixel style enhanced with modern lighting. Battle deadly sea creatures, face powerful bosses, and uncover hidden secrets in a fast-paced, story-driven journey of discovery and survival.',
    'In Development',
    '@TidespawnGame',
    'https://x.com/TidespawnGame/status/2050926856602268120',
    'https://www.kickstarter.com/projects/longlost/tidespawn',
    'https://i.kickstarter.com/assets/053/362/987/04cd3b882a374fdf21af28c3595bbf01_original.png?fit=scale-down&origin=ugc&q=100&v=1776332911&width=700&sig=IqGbmVSk1lC0%2BYcLvZidzWFjcoJuVPRjiCyjRrx80%2Bo%3D',
    true
  ),
  (
    'Jamesika',
    'Infinite Ball Well',
    'INFINITE BALL WELL is a fast-paced Pachinko roguelite. Launch Pinballs to strike Pegs and score points. Experiment with different Peg and Relic combos and smash your way ever deeper into the earth!',
    'In Development',
    '@Hi_Jamesika',
    'https://x.com/Hi_Jamesika/status/2050757235719180447',
    'https://store.steampowered.com/app/3305820/Infinite_Ball_Well/?curator_clanid=45579263',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3305820/ac6574c63df057bec9ac54490ae397c10618c786/ss_ac6574c63df057bec9ac54490ae397c10618c786.1920x1080.jpg?t=1777773490',
    true
  );
