# IndieScope — Indie Game Reviews

A Next.js 14 + Supabase indie game review site with editor reviews and community reviews.

## Stack

- **Next.js 14** (App Router, Server Components)
- **Supabase** (Postgres, Auth, Storage)
- **Tailwind CSS**
- **TypeScript**

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 3. Run the schema

In your Supabase dashboard, go to **SQL Editor** and paste + run the contents of `schema.sql`.

### 4. Configure environment variables

Copy `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project under **Settings → API**.

### 5. Rename the dynamic route folder

After unzipping, rename:
```
src/app/games/slug  →  src/app/games/[slug]
```

### 6. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Home — game listing
│   ├── layout.tsx                # Root layout + Navbar
│   ├── not-found.tsx
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── games/
│       └── [slug]/page.tsx       # Game detail + reviews
├── components/
│   ├── ui/
│   │   └── Navbar.tsx
│   ├── game/
│   │   ├── GameCard.tsx
│   │   └── GameHero.tsx
│   └── review/
│       ├── EditorReviewSection.tsx
│       ├── CommunityReviewList.tsx
│       ├── CommunityReviewCard.tsx
│       └── ReviewForm.tsx
├── lib/
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts             # Browser client
│       ├── server.ts             # Server Component client
│       └── middleware.ts         # Session refresh
├── middleware.ts                 # Auth route protection
└── types/
    └── database.ts               # Full typed Supabase schema
```

## Adding games & editor reviews

Currently done directly in Supabase. To add a game:

1. Insert a row into `games` with a unique `slug`
2. Insert a row into `editor_reviews` referencing that game's `id`

A future admin panel can be added at `/admin` behind a role check.
