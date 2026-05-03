import { createClient } from "@/lib/supabase/server"
import { GameGrid } from "@/components/game/GameGrid"
import { SearchAndFilter } from "@/components/game/SearchAndFilter"
import Link from "next/link"
import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

export const metadata = {
  title: "IndieScout — Indie Game Reviews",
  description: "Discover the best indie games. Expert reviews, community opinions, editor picks and more.",
}

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null }

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

function SectionLabel({ children, link, linkText }: { children: React.ReactNode; link?: string; linkText?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px", flexShrink: 0 }} />
      <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>{children}</p>
      <div style={{ flex: 1, height: "1px", background: "rgba(109,40,217,0.1)" }} />
      {link && <Link href={link} style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", textDecoration: "none", flexShrink: 0 }}>{linkText ?? "View all →"}</Link>}
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.from("games").select("*, editor_reviews(score_overall)").order("created_at", { ascending: false })
  const games = (data ?? []) as unknown as GameWithReview[]

  const featured = games.find((g) => g.is_featured) ?? null
  const spotlight = games.find((g) => g.is_spotlight) ?? null
  const editorPicks = games.filter((g) => g.editor_pick_label)
  const trending = [...games].sort((a, b) => (b.editor_reviews?.[0]?.score_overall ?? 0) - (a.editor_reviews?.[0]?.score_overall ?? 0)).slice(0, 5)
  const allGenres = Array.from(new Set(games.flatMap((g) => g.genres ?? []))).sort()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Featured hero */}
      {featured && (() => {
        const sc = featured.editor_reviews?.[0] ? scoreColor(featured.editor_reviews[0].score_overall) : null
        return (
          <div>
            <Link href={`/games/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                background: "linear-gradient(135deg, #2d1b69, #1e1b6e)",
                borderRadius: "12px", padding: "28px",
                display: "flex", alignItems: "center", gap: "20px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "180px", height: "180px", background: "rgba(167,139,250,0.15)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
                <div style={{ flex: 1, position: "relative", zIndex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", padding: "3px 8px", borderRadius: "5px" }}>★ Featured</span>
                    {(featured.genres ?? []).slice(0, 2).map((g: string) => (
                      <span key={g} style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: "5px" }}>{g}</span>
                    ))}
                  </div>
                  <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", marginBottom: "6px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{featured.title}</h1>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>{featured.developer}{featured.release_year ? ` · ${featured.release_year}` : ""}</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "18px" }}>{featured.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff", padding: "9px 18px", borderRadius: "9px" }}>Read review →</span>
                    {sc && featured.editor_reviews?.[0] && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: sc.bg, border: `1px solid ${sc.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: sc.color }}>
                          {featured.editor_reviews[0].score_overall}
                        </div>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Editor score</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ width: "130px", height: "130px", borderRadius: "12px", flexShrink: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>
                  {featured.cover_url
                    ? <img src={featured.cover_url} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: "rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "44px", fontWeight: 800, color: "rgba(167,139,250,0.4)" }}>{featured.title[0]}</span></div>
                  }
                </div>
              </div>
            </Link>
          </div>
        )
      })()}

      {/* Search */}
      <div style={box}>
        <SearchAndFilter games={games} allGenres={allGenres} />
      </div>

      {/* All games */}
      <div style={box}>
        <SectionLabel link="/games" linkText="Browse all →">All games</SectionLabel>
        <GameGrid games={games} pageSize={6} />
      </div>

      {/* Spotlight */}
      {spotlight && (
        <div style={box}>
          <SectionLabel>Indie spotlight</SectionLabel>
          <Link href={`/games/${spotlight.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ display: "flex", overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.04)" }}>
              <div style={{ width: "4px", background: "linear-gradient(180deg, #fbbf24, #f59e0b)", flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "16px 20px", minWidth: 0 }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "6px" }}>This month&apos;s spotlight</p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#1e1b4b", marginBottom: "6px" }}>{spotlight.title}</p>
                <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6 }}>{spotlight.spotlight_quote ?? spotlight.description}</p>
              </div>
              <div style={{ width: "80px", flexShrink: 0, overflow: "hidden" }}>
                {spotlight.cover_url
                  ? <img src={spotlight.cover_url} alt={spotlight.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "28px" }}>{spotlight.title[0]}</span></div>
                }
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <div style={box}>
          <SectionLabel>Trending games</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {trending.map((game, i) => {
              const sc = game.editor_reviews?.[0] ? scoreColor(game.editor_reviews[0].score_overall) : null
              return (
                <Link key={game.id} href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", background: i % 2 === 0 ? "rgba(109,40,217,0.03)" : "transparent" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(109,40,217,0.25)", width: "18px", textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ width: "34px", height: "34px", borderRadius: "7px", background: "rgba(109,40,217,0.08)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {game.cover_url ? <img src={game.cover_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>{game.title[0]}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e1b4b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.title}</p>
                      <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{(game.genres ?? []).slice(0, 2).join(" · ")}</p>
                    </div>
                    {sc && game.editor_reviews?.[0] && (
                      <div style={{ padding: "3px 8px", borderRadius: "5px", background: sc.bg, fontSize: "12px", fontWeight: 700, color: sc.color, flexShrink: 0 }}>
                        {game.editor_reviews[0].score_overall}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Editor picks */}
      {editorPicks.length > 0 && (
        <div style={box}>
          <SectionLabel>Editor picks</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
            {editorPicks.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "rgba(109,40,217,0.04)", border: "1px solid rgba(109,40,217,0.1)", borderRadius: "10px", padding: "14px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{game.editor_pick_label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b", marginBottom: "4px" }}>{game.title}</p>
                  <p style={{ fontSize: "11px", color: "#7c3aed" }}>Read review →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}