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
  padding: "20px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

function SectionLabel({ children, link, linkText }: { children: React.ReactNode; link?: string; linkText?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px", flexShrink: 0 }} />
      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>{children}</p>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Featured hero — no white box wrapper */}
      {featured && (() => {
        const sc = featured.editor_reviews?.[0] ? scoreColor(featured.editor_reviews[0].score_overall) : null
        return (
          <div>
            <Link href={`/games/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                background: "linear-gradient(135deg, #2d1b69, #1e1b6e)",
                borderRadius: "16px", padding: "20px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "180px", height: "180px", background: "rgba(167,139,250,0.15)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />

                {/* Cover image top on mobile, right on desktop */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", padding: "3px 8px", borderRadius: "5px" }}>★ Featured</span>
                      {(featured.genres ?? []).slice(0, 2).map((g: string) => (
                        <span key={g} style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: "5px" }}>{g}</span>
                      ))}
                    </div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "4px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>{featured.title}</h2>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>{featured.developer}{featured.release_year ? ` · ${featured.release_year}` : ""}</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "16px", wordBreak: "break-word" }}>{featured.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff", padding: "9px 16px", borderRadius: "9px" }}>Read review →</span>
                      {sc && featured.editor_reviews?.[0] && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: sc.bg, border: `1px solid ${sc.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: sc.color }}>
                            {featured.editor_reviews[0].score_overall}
                          </div>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Editor score</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Cover image — hidden on very small screens via CSS */}
                  <div className="hero-image" style={{ width: "100px", height: "100px", borderRadius: "10px", flexShrink: 0, overflow: "hidden" }}>
                    {featured.cover_url
                      ? <img src={featured.cover_url} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", background: "rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "32px", fontWeight: 800, color: "rgba(167,139,250,0.4)" }}>{featured.title[0]}</span></div>
                    }
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      })()}

      <div style={box}><SearchAndFilter games={games} allGenres={allGenres} /></div>

      <div style={box}>
        <SectionLabel link="/games" linkText="Browse all →">All games</SectionLabel>
        <GameGrid games={games} pageSize={6} />
      </div>

      {spotlight && (
        <div style={box}>
          <SectionLabel>Indie spotlight</SectionLabel>
          <Link href={`/games/${spotlight.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ display: "flex", overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.04)" }}>
              <div style={{ width: "4px", background: "linear-gradient(180deg, #fbbf24, #f59e0b)", flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "14px 18px", minWidth: 0 }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px" }}>This month&apos;s spotlight</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e1b4b", marginBottom: "5px" }}>{spotlight.title}</p>
                <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6 }}>{spotlight.spotlight_quote ?? spotlight.description}</p>
              </div>
              <div style={{ width: "72px", flexShrink: 0, overflow: "hidden" }}>
                {spotlight.cover_url
                  ? <img src={spotlight.cover_url} alt={spotlight.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "24px" }}>{spotlight.title[0]}</span></div>
                }
              </div>
            </div>
          </Link>
        </div>
      )}

      {trending.length > 0 && (
        <div style={box}>
          <SectionLabel>Trending games</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {trending.map((game, i) => {
              const sc = game.editor_reviews?.[0] ? scoreColor(game.editor_reviews[0].score_overall) : null
              return (
                <Link key={game.id} href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "10px", background: i % 2 === 0 ? "rgba(109,40,217,0.03)" : "transparent" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(109,40,217,0.25)", width: "16px", textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(109,40,217,0.08)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {game.cover_url ? <img src={game.cover_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed" }}>{game.title[0]}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e1b4b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.title}</p>
                      <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{(game.genres ?? []).slice(0, 2).join(" · ")}</p>
                    </div>
                    {sc && game.editor_reviews?.[0] && (
                      <div style={{ padding: "2px 8px", borderRadius: "5px", background: sc.bg, fontSize: "12px", fontWeight: 700, color: sc.color, flexShrink: 0 }}>
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

      {editorPicks.length > 0 && (
        <div style={box}>
          <SectionLabel>Editor picks</SectionLabel>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
            {editorPicks.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "10px", padding: "14px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>{game.editor_pick_label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b", marginBottom: "3px" }}>{game.title}</p>
                  <p style={{ fontSize: "11px", color: "#7c3aed" }}>Read review →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Discord community banner */}
      <div style={{ background: "linear-gradient(135deg, #2d1b69, #1e1b6e)", borderRadius: "16px", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "6px", letterSpacing: "-0.3px" }}>Join the IndieScout community</p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>Chat with fellow indie game fans, suggest games, and apply to become a reviewer.</p>
        </div>
        <a href="https://discord.gg/N2Kzv9DYtv" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, background: "#5865f2", color: "#fff", padding: "12px 22px", borderRadius: "10px", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          Join Discord
        </a>
      </div>

    </div>
  )
}