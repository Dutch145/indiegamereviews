import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const BASE = "https://indiescout.xyz"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [{ data: games }, { data: editorReviews }] = await Promise.all([
    supabase.from("games").select("slug, created_at").order("created_at", { ascending: false }),
    supabase.from("editor_reviews").select("games(slug), published_at"),
  ])

  const gameUrls: MetadataRoute.Sitemap = (games ?? []).map((g) => ({
    url: `${BASE}/games/${g.slug}`,
    lastModified: new Date(g.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  // Bump priority for games that have editor reviews
  const reviewedSlugs = new Set(
    (editorReviews ?? []).map((r: any) => r.games?.slug).filter(Boolean)
  )
  gameUrls.forEach((entry) => {
    const slug = entry.url.split("/games/")[1]
    if (slug && reviewedSlugs.has(slug)) entry.priority = 0.9
  })

  return [
    { url: BASE,                       lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/games`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/reviews`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.85 },
    { url: `${BASE}/developers`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/leaderboard`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.6 },
    { url: `${BASE}/suggest`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.55 },
    { url: `${BASE}/join`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...gameUrls,
  ]
}
