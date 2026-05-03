import { createClient } from "@/lib/supabase/server"
import { SearchAndFilter } from "@/components/game/SearchAndFilter"
import type { Game } from "@/types/database"

export const metadata = {
  title: "Browse Games",
  description: "Browse and search all indie games reviewed on IndieScout.",
}

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null }

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

export default async function BrowseGamesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("games").select("*, editor_reviews(score_overall)").order("created_at", { ascending: false })
  const games = (data ?? []) as unknown as GameWithReview[]
  const allGenres = Array.from(new Set(games.flatMap((g) => g.genres ?? []))).sort()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={box}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px", letterSpacing: "-0.5px" }}>Browse games</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>
          <span style={{ fontWeight: 700, color: "#7c3aed" }}>{games.length} indie games</span> reviewed and counting.
        </p>
      </div>
      <div style={box}>
        <SearchAndFilter games={games} allGenres={allGenres} alwaysOpen />
      </div>
    </div>
  )
}