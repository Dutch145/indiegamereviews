import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { scoreColor, formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import type { CommunityReviewWithVotes } from "@/types/database"
import { CommunityReviewsFeed } from "@/components/review/CommunityReviewsFeed"

export const metadata: Metadata = {
  title: "Reviews",
  description: "All indie game reviews on IndieScout.",
}

type EditorReviewWithGame = {
  id: string; author: string; published_at: string; verdict: string; score_overall: number;
  games: { title: string; slug: string; cover_url: string | null } | null
}
type CommunityReviewWithGame = CommunityReviewWithVotes & {
  games: { title: string; slug: string; cover_url: string | null } | null
}

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

export default async function ReviewsPage() {
  const supabase = await createClient()
  const { data: editorData } = await supabase.from("editor_reviews").select("id, author, published_at, verdict, score_overall, games(title, slug, cover_url)").order("published_at", { ascending: false })
  const { data: communityData } = await supabase.from("community_reviews_with_votes").select("*, games(title, slug, cover_url)").order("created_at", { ascending: false }).limit(20)

  const editors = (editorData ?? []) as unknown as EditorReviewWithGame[]
  const community = (communityData ?? []) as unknown as CommunityReviewWithGame[]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Editor reviews */}
      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "3px", height: "16px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1e1b4b" }}>Editor reviews</h1>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "2px 10px", borderRadius: "20px" }}>{editors.length}</span>
        </div>
        {editors.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {editors.map((review) => {
              const sc = scoreColor(review.score_overall)
              return (
                <Link key={review.id} href={`/games/${review.games?.slug}`} style={{ textDecoration: "none", display: "flex", gap: "14px", background: "rgba(109,40,217,0.03)", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ width: "44px", height: "60px", borderRadius: "8px", background: "rgba(109,40,217,0.08)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {review.games?.cover_url ? <img src={review.games.cover_url} alt={review.games.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#7c3aed", fontWeight: 700 }}>{review.games?.title[0]}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b" }}>{review.games?.title}</p>
                        <p style={{ fontSize: "11px", color: "#9d8fc0" }}>By {review.author} · {formatDate(review.published_at)}</p>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: sc.color, background: sc.bg, padding: "3px 8px", borderRadius: "6px", flexShrink: 0 }}>{review.score_overall}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{review.verdict}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : <p style={{ fontSize: "14px", color: "#9d8fc0", textAlign: "center", padding: "32px 0" }}>No editor reviews yet.</p>}
      </div>

      {/* Community reviews */}
      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "3px", height: "16px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e1b4b" }}>Community quick reviews</h2>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "2px 10px", borderRadius: "20px" }}>{community.length}</span>
        </div>
        {community.length > 0
          ? <CommunityReviewsFeed initial={community as any} />
          : <p style={{ fontSize: "14px", color: "#9d8fc0", textAlign: "center", padding: "32px 0" }}>No community reviews yet.</p>
        }
      </div>
    </div>
  )
}