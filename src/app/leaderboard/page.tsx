import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "IndieScout community leaderboard — top reviewers and contributors.",
}

const POINTS = { review: 10, request: 5, helpfulVote: 2, spotlight: 25 }

function getRank(pts: number) {
  if (pts >= 1000) return { label: "Legend",      color: "#7c3aed", bg: "rgba(124,58,237,0.1)" }
  if (pts >= 500)  return { label: "Veteran",     color: "#059669", bg: "rgba(5,150,105,0.1)" }
  if (pts >= 150)  return { label: "Contributor", color: "#2563eb", bg: "rgba(37,99,235,0.1)" }
  if (pts >= 50)   return { label: "Explorer",    color: "#d97706", bg: "rgba(217,119,6,0.1)" }
  return             { label: "Scout",        color: "#6d60c0", bg: "rgba(109,40,217,0.08)" }
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" }

const box: React.CSSProperties = {
  background: "#fff", borderRadius: "16px", padding: "24px",
  border: "1px solid rgba(109,40,217,0.1)", boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const [
    { data: reviews },
    { data: requests },
    { data: helpfulVotes },
    { data: spotlights },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("community_reviews").select("user_id"),
    supabase.from("game_requests").select("user_id"),
    supabase.from("helpful_votes").select("helpful, community_reviews(user_id)").eq("helpful", true),
    (supabase as any).from("developer_spotlight").select("user_id").not("user_id", "is", null),
    supabase.from("profiles").select("id, username, is_reviewer, is_admin, created_at"),
  ])

  // Aggregate per user
  const reviewCounts: Record<string, number> = {}
  for (const r of reviews ?? []) {
    if (r.user_id) reviewCounts[r.user_id] = (reviewCounts[r.user_id] ?? 0) + 1
  }

  const requestCounts: Record<string, number> = {}
  for (const r of requests ?? []) {
    if (r.user_id) requestCounts[r.user_id] = (requestCounts[r.user_id] ?? 0) + 1
  }

  const helpfulCounts: Record<string, number> = {}
  for (const v of helpfulVotes ?? []) {
    const uid = (v.community_reviews as any)?.user_id
    if (uid) helpfulCounts[uid] = (helpfulCounts[uid] ?? 0) + 1
  }

  const spotlightCounts: Record<string, number> = {}
  for (const s of spotlights ?? []) {
    if (s.user_id) spotlightCounts[s.user_id] = (spotlightCounts[s.user_id] ?? 0) + 1
  }

  type Entry = {
    id: string; username: string; is_reviewer: boolean; is_admin: boolean
    reviews: number; requests: number; helpful: number; spotlights: number; total: number
  }

  const entries: Entry[] = (profiles ?? [])
    .map((p: any) => {
      const r = reviewCounts[p.id] ?? 0
      const q = requestCounts[p.id] ?? 0
      const h = helpfulCounts[p.id] ?? 0
      const s = spotlightCounts[p.id] ?? 0
      return {
        id: p.id, username: p.username,
        is_reviewer: p.is_reviewer, is_admin: p.is_admin,
        reviews: r, requests: q, helpful: h, spotlights: s,
        total: r * POINTS.review + q * POINTS.request + h * POINTS.helpfulVote + s * POINTS.spotlight,
      }
    })
    .filter((e) => e.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 50)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto" }}>

      {/* Header */}
      <div style={box}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "6px" }}>Community Leaderboard</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>Top contributors ranked by community points. Earn points by writing reviews, suggesting games, receiving helpful votes, and submitting developer spotlights.</p>
      </div>

      {/* Point legend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
        {[
          { label: "Review", pts: "+10 pts", color: "#7c3aed" },
          { label: "Game suggested", pts: "+5 pts", color: "#d97706" },
          { label: "Helpful vote", pts: "+2 pts", color: "#059669" },
          { label: "Spotlight submitted", pts: "+25 pts", color: "#2563eb" },
        ].map(({ label, pts, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "10px", padding: "10px 14px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color, marginBottom: "2px" }}>{pts}</p>
            <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={box}>
        {entries.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#9d8fc0", textAlign: "center", padding: "32px 0" }}>No contributors yet — be the first to earn points!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {entries.map((entry, i) => {
              const rank = getRank(entry.total)
              const pos = i + 1
              return (
                <Link key={entry.id} href={`/user/${encodeURIComponent(entry.username)}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "12px",
                    background: pos <= 3 ? rank.bg : "rgba(109,40,217,0.02)",
                    border: `1px solid ${pos <= 3 ? rank.color + "33" : "rgba(109,40,217,0.07)"}`,
                  }}>
                    {/* Position */}
                    <span style={{ fontSize: pos <= 3 ? "20px" : "13px", fontWeight: 700, color: "rgba(109,40,217,0.3)", width: "28px", textAlign: "center", flexShrink: 0 }}>
                      {MEDAL[pos] ?? pos}
                    </span>

                    {/* Avatar */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${rank.color}, #4f46e5)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {entry.username.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Name + badges */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b" }}>{entry.username}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: rank.color, background: rank.bg, padding: "2px 7px", borderRadius: "10px" }}>{rank.label}</span>
                        {entry.is_admin && <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", padding: "2px 7px", borderRadius: "10px" }}>Admin</span>}
                        {entry.is_reviewer && !entry.is_admin && <span style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "2px 7px", borderRadius: "10px" }}>Reviewer</span>}
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "3px", flexWrap: "wrap" }}>
                        {entry.reviews > 0    && <span style={{ fontSize: "10px", color: "#9d8fc0" }}>{entry.reviews} review{entry.reviews !== 1 ? "s" : ""}</span>}
                        {entry.requests > 0   && <span style={{ fontSize: "10px", color: "#9d8fc0" }}>{entry.requests} suggestion{entry.requests !== 1 ? "s" : ""}</span>}
                        {entry.helpful > 0    && <span style={{ fontSize: "10px", color: "#9d8fc0" }}>{entry.helpful} helpful vote{entry.helpful !== 1 ? "s" : ""}</span>}
                        {entry.spotlights > 0 && <span style={{ fontSize: "10px", color: "#9d8fc0" }}>{entry.spotlights} spotlight{entry.spotlights !== 1 ? "s" : ""}</span>}
                      </div>
                    </div>

                    {/* Points */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "18px", fontWeight: 800, color: rank.color, letterSpacing: "-0.5px" }}>{entry.total.toLocaleString()}</p>
                      <p style={{ fontSize: "9px", color: "#9d8fc0", fontWeight: 600 }}>pts</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
