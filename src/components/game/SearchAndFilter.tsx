"use client"

import { useState, useMemo } from "react"
import { GameGrid } from "./GameGrid"
import type { Game } from "@/types/database"
import { getGenreStyle } from "@/lib/genreStyles"

type GameWithReview = Game & {
  editor_reviews: Array<{ score_overall: number }> | null
  community_reviews?: Array<{ score: number }> | null
}
type SortOption = "newest" | "score" | "az"

const PLATFORMS: { label: string; keyword: string | null }[] = [
  { label: "All",         keyword: null },
  { label: "PC",          keyword: "pc" },
  { label: "Switch",      keyword: "switch" },
  { label: "PlayStation", keyword: "ps" },
  { label: "Xbox",        keyword: "xbox" },
  { label: "Mobile",      keyword: "mobile" },
]

interface Props {
  games: GameWithReview[]
  allGenres: string[]
  alwaysOpen?: boolean
}

export function SearchAndFilter({ games, allGenres, alwaysOpen = false }: Props) {
  const [query,           setQuery]           = useState("")
  const [selectedGenre,   setSelectedGenre]   = useState<string | null>(null)
  const [selectedPlatform,setSelectedPlatform]= useState<string | null>(null)
  const [sort,            setSort]            = useState<SortOption>("score")
  const [isOpen,          setIsOpen]          = useState(alwaysOpen)

  // Count how many games belong to each genre (across the full unfiltered list)
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const game of games) {
      for (const genre of game.genres ?? []) {
        counts[genre] = (counts[genre] ?? 0) + 1
      }
    }
    return counts
  }, [games])

  const filtered = useMemo(() => {
    let result = [...games]
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((g) => g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q))
    }
    if (selectedGenre)    result = result.filter((g) => (g.genres ?? []).includes(selectedGenre))
    if (selectedPlatform) result = result.filter((g) =>
      (g.platforms ?? []).some((p) => p.toLowerCase().includes(selectedPlatform))
    )
    if (sort === "score") result.sort((a, b) => (b.editor_reviews?.[0]?.score_overall ?? 0) - (a.editor_reviews?.[0]?.score_overall ?? 0))
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title))
    return result
  }, [games, query, selectedGenre, selectedPlatform, sort])

  function clearAll() {
    setQuery("")
    setSelectedGenre(null)
    setSelectedPlatform(null)
    setSort("score")
  }

  const hasFilters = !!query.trim() || !!selectedGenre || !!selectedPlatform || sort !== "score"

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
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" }}>

      {/* Search + Sort row */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input
          autoFocus={!alwaysOpen}
          type="text"
          placeholder="Search by title or developer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: "100px", fontSize: "14px", background: "#faf8ff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "10px 14px", color: "#1e1b4b", outline: "none" }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          style={{ fontSize: "13px", background: "#faf8ff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "10px 12px", color: "#6d60c0", outline: "none", cursor: "pointer", flexShrink: 0 }}
        >
          <option value="score">Top rated</option>
          <option value="newest">Newest</option>
          <option value="az">A–Z</option>
        </select>
        {!alwaysOpen && (
          <button onClick={() => { setIsOpen(false); clearAll() }} style={{ fontSize: "13px", fontWeight: 600, color: "#9d8fc0", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", flexShrink: 0 }}>✕</button>
        )}
      </div>

      {/* Platform tabs */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {PLATFORMS.map(({ label, keyword }) => {
          const active = selectedPlatform === keyword
          return (
            <button
              key={label}
              onClick={() => setSelectedPlatform(keyword)}
              style={{
                fontSize: "11px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
                background: active ? "#7c3aed" : "rgba(255,255,255,0.7)",
                border: active ? "1.5px solid #7c3aed" : "1px solid rgba(109,40,217,0.15)",
                color: active ? "#fff" : "#9d8fc0",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Genre pills with counts */}
      {allGenres.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {allGenres.map((genre: string) => {
            const gs    = getGenreStyle(genre)
            const active = selectedGenre === genre
            const count  = genreCounts[genre] ?? 0
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(active ? null : genre)}
                style={{
                  fontSize: "11px", fontWeight: 600, padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                  background: active ? gs.bg : "rgba(255,255,255,0.7)",
                  border:     active ? `1.5px solid ${gs.border}` : "1px solid rgba(109,40,217,0.12)",
                  color:      active ? gs.color : "#9d8fc0",
                }}
              >
                {genre}
                <span style={{ marginLeft: "4px", opacity: 0.5, fontWeight: 400 }}>· {count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontSize: "12px", color: "#9d8fc0" }}>{filtered.length} game{filtered.length !== 1 ? "s" : ""} found</p>
            {hasFilters && (
              <button onClick={clearAll} style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>
                Clear filters ✕
              </button>
            )}
          </div>
          <GameGrid games={filtered} pageSize={12} />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ color: "#9d8fc0", fontSize: "14px" }}>No games found.</p>
          <button onClick={clearAll} style={{ color: "#7c3aed", fontSize: "13px", background: "none", border: "none", cursor: "pointer", marginTop: "8px" }}>Clear filters</button>
        </div>
      )}
    </div>
  )
}
