import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import { scoreColor, formatDate } from "@/lib/utils"

const POINTS = { review: 10, request: 5, helpfulVote: 2, spotlight: 25 }

function getRank(pts: number) {
  if (pts >= 1000) return { label: "Legend",      color: "#7c3aed", bg: "rgba(124,58,237,0.12)" }
  if (pts >= 500)  return { label: "Veteran",     color: "#059669", bg: "rgba(5,150,105,0.12)" }
  if (pts >= 150)  return { label: "Contributor", color: "#2563eb", bg: "rgba(37,99,235,0.12)" }
  if (pts >= 50)   return { label: "Explorer",    color: "#d97706", bg: "rgba(217,119,6,0.12)" }
  return             { label: "Scout",        color: "#6d60c0", bg: "rgba(109,40,217,0.1)" }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return { title: `${params.username} — IndieScout` }
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient()
  const username = decodeURIComponent(params.username)

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .ilike("username", username)
    .single()

  if (!profile) {
    // No account — check if they have editor reviews by this author name
    const { data: editorReviews } = await supabase
      .from("editor_reviews")
      .select("id, score_overall, score_gameplay, score_visuals, score_replayability, score_audio, summary, verdict, published_at, games(title, slug, cover_url)")
      .ilike("author", username)
      .order("published_at", { ascending: false })

    if (!editorReviews || editorReviews.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "64px 16px", maxWidth: "400px", margin: "0 auto" }}>
          <p style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b", marginBottom: "8px" }}>Profile not found</p>
          <p style={{ fontSize: "13px", color: "#6d60c0", marginBottom: "20px" }}>No IndieScout account or reviews found for <strong>{username}</strong>.</p>
          <Link href="/" style={{ fontSize: "13px", color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>← Back to home</Link>
        </div>
      )
    }

    type EditorReviewRow = {
      id: string; score_overall: number; summary: string; verdict: string
      published_at: string; games: { title: string; slug: string; cover_url: string | null } | null
    }
    const edList = editorReviews as unknown as EditorReviewRow[]
    const initials = username.slice(0, 2).toUpperCase()
    const box: React.CSSProperties = { background: "#fff", border: "1px solid rgba(109,40,217,0.1)", borderRadius: "16px", boxShadow: "0 2px 12px rgba(109,40,217,0.06)" }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto" }}>
        <Link href="/" style={{ fontSize: "12px", color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>← Back</Link>

        <div style={{ ...box, padding: "28px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "4px" }}>{username}</p>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "3px 10px", borderRadius: "20px" }}>IndieScout Editor</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "32px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-1px", lineHeight: 1 }}>{edList.length}</p>
            <p style={{ fontSize: "11px", color: "#9d8fc0", marginTop: "2px" }}>reviews published</p>
          </div>
        </div>

        <div style={{ ...box, padding: "20px 24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0", marginBottom: "4px" }}>Editor reviews</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {edList.map((review) => {
              const sc = scoreColor(review.score_overall)
              return (
                <div key={review.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid rgba(109,40,217,0.07)" }}>
                  <Link href={`/games/${review.games?.slug}`} style={{ width: "44px", height: "44px", borderRadius: "8px", background: "rgba(109,40,217,0.08)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    {review.games?.cover_url
                      ? <img src={review.games.cover_url} alt={review.games.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: "14px", fontWeight: 700, color: "#7c3aed" }}>{review.games?.title?.[0]}</span>
                    }
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                      <Link href={`/games/${review.games?.slug}`} style={{ fontSize: "14px", fontWeight: 600, color: "#1e1b4b", textDecoration: "none" }}>{review.games?.title}</Link>
                      <div style={{ padding: "2px 8px", borderRadius: "6px", background: sc.bg, fontSize: "12px", fontWeight: 700, color: sc.color, flexShrink: 0 }}>{review.score_overall}</div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{review.summary}</p>
                    <p style={{ fontSize: "11px", color: "#c4b5fd", marginTop: "4px" }}>{formatDate(review.published_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const [
    { data: reviews },
    { count: requestCount },
  ] = await Promise.all([
    supabase
      .from("community_reviews")
      .select("id, score, body, created_at, games(title, slug, cover_url)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("game_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id),
  ])

  const reviewList = (reviews ?? []) as unknown as Array<{ id: string; score: number; body: string; created_at: string; games: { title: string; slug: string; cover_url: string | null } | null }>

  let helpfulVotes = 0
  if (reviewList.length > 0) {
    const { data: voteData } = await supabase
      .from("helpful_votes")
      .select("id")
      .in("review_id", reviewList.map((r) => r.id))
      .eq("helpful", true)
    helpfulVotes = voteData?.length ?? 0
  }

  let spotlightCount = 0
  try {
    const { count } = await (supabase as any)
      .from("developer_spotlight")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
    spotlightCount = count ?? 0
  } catch { spotlightCount = 0 }

  const totalPoints =
    reviewList.length * POINTS.review +
    (requestCount ?? 0) * POINTS.request +
    helpfulVotes * POINTS.helpfulVote +
    spotlightCount * POINTS.spotlight

  const rank = getRank(totalPoints)
  const initials = username.slice(0, 2).toUpperCase()

  const box: React.CSSProperties = {
    background: "#fff",
    border: "1px solid rgba(109,40,217,0.1)",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto" }}>

      <Link href="/" style={{ fontSize: "12px", color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>← Back</Link>

      {/* Profile header */}
      <div style={{ ...box, padding: "28px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "4px" }}>{username}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: rank.color, background: rank.bg, padding: "3px 10px", borderRadius: "20px" }}>{rank.label}</span>
            <span style={{ fontSize: "12px", color: "#9d8fc0" }}>Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "32px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-1px", lineHeight: 1 }}>{totalPoints.toLocaleString()}</p>
          <p style={{ fontSize: "11px", color: "#9d8fc0", marginTop: "2px" }}>community points</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
        {[
          { label: "Reviews written", value: reviewList.length, pts: reviewList.length * POINTS.review },
          { label: "Helpful votes earned", value: helpfulVotes, pts: helpfulVotes * POINTS.helpfulVote },
          { label: "Games suggested", value: requestCount ?? 0, pts: (requestCount ?? 0) * POINTS.request },
        ].map(({ label, value, pts }) => (
          <div key={label} style={{ ...box, padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px" }}>{value}</p>
            <p style={{ fontSize: "11px", color: "#9d8fc0", marginTop: "2px" }}>{label}</p>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", marginTop: "4px" }}>+{pts} pts</p>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div style={{ ...box, padding: "20px 24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0", marginBottom: "4px" }}>
          Community reviews
        </p>
        {reviewList.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9d8fc0", padding: "24px 0", textAlign: "center" }}>No reviews yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {reviewList.map((review) => {
              const sc = scoreColor(review.score)
              return (
                <div key={review.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid rgba(109,40,217,0.07)" }}>
                  <Link href={`/games/${review.games?.slug}`} style={{ width: "44px", height: "44px", borderRadius: "8px", background: "rgba(109,40,217,0.08)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                    {review.games?.cover_url
                      ? <img src={review.games.cover_url} alt={review.games.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: "14px", fontWeight: 700, color: "#7c3aed" }}>{review.games?.title[0]}</span>
                    }
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                      <Link href={`/games/${review.games?.slug}`} style={{ fontSize: "14px", fontWeight: 600, color: "#1e1b4b", textDecoration: "none" }}>{review.games?.title}</Link>
                      <div style={{ padding: "2px 8px", borderRadius: "6px", background: sc.bg, fontSize: "12px", fontWeight: 700, color: sc.color, flexShrink: 0 }}>{review.score}</div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{review.body}</p>
                    <p style={{ fontSize: "11px", color: "#c4b5fd", marginTop: "4px" }}>{formatDate(review.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
