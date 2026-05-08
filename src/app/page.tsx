import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Game } from "@/types/database"
import { scoreColor, formatDate } from "@/lib/utils"
import { DeveloperBadge } from "@/components/ui/DeveloperBadge"

export const metadata = {
  title: "IndieScout — Indie Game Reviews",
  description: "Discover the best indie games. Expert reviews, community opinions, editor picks and more.",
}

type GameWithReview = Game & {
  editor_reviews: Array<{ score_overall: number }> | null
  community_reviews: Array<{ score: number }> | null
}

type SteamGame = {
  logo: string  // capsule_sm_120 URL — contains appid as /steam/apps/{id}/
  name: string
}

type LatestReview = {
  id: string
  author: string
  summary: string
  verdict: string
  score_overall: number
  published_at: string
  games: { title: string; slug: string; developer: string; cover_url: string | null; genres: string[] | null } | null
}

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
  const { data } = await supabase.from("games").select("*, editor_reviews(score_overall), community_reviews(score)").order("created_at", { ascending: false })
  const games = (data ?? []) as unknown as GameWithReview[]

  const { data: latestReviewRaw } = await supabase
    .from("editor_reviews")
    .select("id, author, summary, verdict, score_overall, published_at, games(title, slug, developer, cover_url, genres)")
    .order("published_at", { ascending: false })
    .limit(1)
    .single()
  const latestReview = latestReviewRaw as unknown as LatestReview | null

  const steamNewReleases = await (async (): Promise<SteamGame[]> => {
    try {
      const res = await fetch(
        "https://store.steampowered.com/search/results/?tags=492&sort_by=Released_DESC&json=1&count=25&cc=US&mature_content=0",
        { next: { revalidate: 3600 }, headers: { "User-Agent": "Mozilla/5.0" } }
      )
      if (!res.ok) return []
      const json = await res.json()
      return ((json.items ?? []) as SteamGame[])
        .filter((g) => !/\b(demo|playtest|soundtrack|bundle|dlc)\b/i.test(g.name))
        .slice(0, 10)
    } catch {
      return []
    }
  })()

  const steamTrending = await (async (): Promise<SteamGame[]> => {
    try {
      const res = await fetch(
        "https://store.steampowered.com/search/results/?tags=492&filter=topsellers&json=1&count=15&cc=US&mature_content=0",
        { next: { revalidate: 3600 }, headers: { "User-Agent": "Mozilla/5.0" } }
      )
      if (!res.ok) return []
      const json = await res.json()
      return (json.items ?? []) as SteamGame[]
    } catch {
      return []
    }
  })()

  const featured = games.find((g) => g.is_featured) ?? null
  const spotlight = games.find((g) => g.is_spotlight) ?? null
  const editorPicks = games.filter((g) => g.editor_pick_label)
  const trending = [...games].sort((a, b) => (b.editor_reviews?.[0]?.score_overall ?? 0) - (a.editor_reviews?.[0]?.score_overall ?? 0)).slice(0, 5)
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

      {latestReview?.games && (() => {
        const sc = scoreColor(latestReview.score_overall)
        const game = latestReview.games!
        return (
          <div style={box}>
            <SectionLabel link="/reviews" linkText="All reviews →">Latest editor&apos;s review</SectionLabel>
            <Link href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(124,58,237,0.03)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ flex: 1, padding: "16px 18px", minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: sc.bg, border: `1px solid ${sc.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: sc.color, flexShrink: 0 }}>
                      {latestReview.score_overall}
                    </div>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e1b4b", lineHeight: 1.2 }}>{game.title}</p>
                      <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{game.developer}</p>
                    </div>
                    {(game.genres ?? []).slice(0, 2).map((g) => (
                      <span key={g} style={{ fontSize: "10px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.15)", padding: "2px 7px", borderRadius: "4px" }}>{g}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: "13px", color: "#3d3580", lineHeight: 1.7, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                    {latestReview.summary}
                  </p>
                  <p style={{ fontSize: "12px", fontStyle: "italic", color: "#6d60c0", borderLeft: "2px solid rgba(124,58,237,0.25)", paddingLeft: "10px", marginBottom: "12px", lineHeight: 1.6 }}>
                    &ldquo;{latestReview.verdict}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "11px", color: "#9d8fc0" }}>By <span style={{ fontWeight: 600, color: "#6d60c0" }}>{latestReview.author}</span> · {formatDate(latestReview.published_at)}</p>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>Read full review →</span>
                  </div>
                </div>
                <div style={{ width: "90px", flexShrink: 0, alignSelf: "stretch", overflow: "hidden" }}>
                  {game.cover_url
                    ? <img src={game.cover_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "28px", fontWeight: 800, color: "rgba(124,58,237,0.3)" }}>{game.title[0]}</span></div>
                  }
                </div>
              </div>
            </Link>
          </div>
        )
      })()}

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

      {(steamTrending.length > 0 || steamNewReleases.length > 0) && (
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

          {steamTrending.length > 0 && (
            <div style={{ ...box, background: "#f3f0ff", border: "1px solid rgba(109,40,217,0.15)", overflow: "hidden" }}>
              <SectionLabel>Top rated indie</SectionLabel>
              <div style={{ maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", paddingRight: "2px" }}>
                {steamTrending.map((game, i) => {
                  const appid = game.logo.match(/\/steam\/apps\/(\d+)\//)?.[1]
                  const storeUrl = appid ? `https://store.steampowered.com/app/${appid}/` : "https://store.steampowered.com"
                  return (
                    <a key={i} href={storeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "10px", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.1)" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(109,40,217,0.4)", width: "14px", textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "rgba(109,40,217,0.1)", flexShrink: 0, overflow: "hidden" }}>
                          <img src={game.logo} alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#1e1b4b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{game.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", padding: "2px 7px", borderRadius: "4px", flexShrink: 0 }}>→</span>
                      </div>
                    </a>
                  )
                })}
              </div>
              <p style={{ fontSize: "11px", color: "rgba(109,40,217,0.4)", textAlign: "right", marginTop: "10px" }}>Top sellers · Indie tag · Steam</p>
            </div>
          )}

          {steamNewReleases.length > 0 && (
            <div style={{ ...box, borderLeft: "4px solid #f59e0b", overflow: "hidden" }}>
              <SectionLabel>New indie releases</SectionLabel>
              <div style={{ maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", paddingRight: "2px" }}>
                {steamNewReleases.map((game, i) => {
                  const appid = game.logo.match(/\/steam\/apps\/(\d+)\//)?.[1]
                  const storeUrl = appid ? `https://store.steampowered.com/app/${appid}/` : "https://store.steampowered.com"
                  return (
                    <a key={i} href={storeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "10px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "rgba(245,158,11,0.2)", flexShrink: 0, overflow: "hidden" }}>
                          <img src={game.logo} alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#1e1b4b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{game.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#92400e", background: "rgba(245,158,11,0.22)", border: "1px solid rgba(245,158,11,0.45)", padding: "2px 7px", borderRadius: "4px", flexShrink: 0 }}>New</span>
                      </div>
                    </a>
                  )
                })}
              </div>
              <p style={{ fontSize: "11px", color: "#b45309", textAlign: "right", marginTop: "10px", opacity: 0.7 }}>New releases · Indie · Steam</p>
            </div>
          )}

        </div>
      )}

      <DeveloperBadge />

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