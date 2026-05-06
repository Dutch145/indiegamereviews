"use client"

import { useState, useMemo } from "react"
import { GameGrid } from "./GameGrid"
import type { Game } from "@/types/database"
import { getGenreStyle } from "@/lib/genreStyles"

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null }
type SortOption = "newest" | "score" | "az"

interface Props {
  games: GameWithReview[]
  allGenres: string[]
  alwaysOpen?: boolean
}

export function SearchAndFilter({ games, allGenres, alwaysOpen = false }: Props) {
  const [query, setQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("newest")
  const [isOpen, setIsOpen] = useState(alwaysOpen)

  const filtered = useMemo(() => {
    let result = [...games]
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((g) => g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q))
    }
    if (selectedGenre) result = result.filter((g) => (g.genres ?? []).includes(selectedGenre))
    if (sort === "score") result.sort((a, b) => (b.editor_reviews?.[0]?.score_overall ?? 0) - (a.editor_reviews?.[0]?.score_overall ?? 0))
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title))
    return result
  }, [games, query, selectedGenre, sort])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "10px", fontSize: "14px", color: "#9d8fc0", cursor: "pointer" }}
      >
        Search games by title or developer...
      </button>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input
          autoFocus={!alwaysOpen}
          type="text"
          placeholder="Search by title or developer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: "160px", fontSize: "14px", background: "#faf8ff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#1e1b4b", outline: "none" }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          style={{ fontSize: "13px", background: "#faf8ff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "10px 12px", color: "#6d60c0", outline: "none", cursor: "pointer", flexShrink: 0 }}
        >
          <option value="newest">Newest</option>
          <option value="score">Top rated</option>
          <option value="az">A–Z</option>
        </select>
        {!alwaysOpen && (
          <button onClick={() => { setIsOpen(false); setQuery(""); setSelectedGenre(null); setSort("newest") }} style={{ fontSize: "13px", fontWeight: 600, color: "#9d8fc0", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", flexShrink: 0 }}>✕</button>
        )}
      </div>
      {allGenres.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {allGenres.map((genre: string) => {
            const gs = getGenreStyle(genre)
            const active = selectedGenre === genre
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(active ? null : genre)}
                style={{
                  fontSize: "11px", fontWeight: 600, padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                  background: active ? gs.bg : "rgba(255,255,255,0.7)",
                  border: active ? `1.5px solid ${gs.border}` : "1px solid rgba(109,40,217,0.12)",
                  color: active ? gs.color : "#9d8fc0",
                }}
              >{genre}</button>
            )
          })}
        </div>
      )}
      {filtered.length > 0 ? (
        <div>
          <p style={{ fontSize: "12px", color: "#9d8fc0", marginBottom: "10px" }}>{filtered.length} game{filtered.length !== 1 ? "s" : ""} found</p>
          <GameGrid games={filtered} pageSize={12} />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ color: "#9d8fc0", fontSize: "14px" }}>No games found.</p>
          <button onClick={() => { setQuery(""); setSelectedGenre(null) }} style={{ color: "#7c3aed", fontSize: "13px", background: "none", border: "none", cursor: "pointer", marginTop: "8px" }}>Clear filters</button>
        </div>
      )}
    </div>
  )
}