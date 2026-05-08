"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { scoreColor, formatDate } from "@/lib/utils"

type CommunityReviewWithGame = {
  id: string | null
  score: number | null
  body: string | null
  created_at: string | null
  username: string | null
  games: { title: string; slug: string; cover_url: string | null } | null
}

interface Props {
  initial: CommunityReviewWithGame[]
}

export function CommunityReviewsFeed({ initial }: Props) {
  const [reviews, setReviews] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initial.length === 20)
  const supabase = createClient()

  async function loadMore() {
    setLoading(true)
    const { data } = await supabase
      .from("community_reviews_with_votes")
      .select("id, score, body, created_at, username, games(title, slug, cover_url)")
      .order("created_at", { ascending: false })
      .range(reviews.length, reviews.length + 19)
    setLoading(false)
    if (!data || data.length === 0) { setHasMore(false); return }
    setReviews((prev) => [...prev, ...(data as unknown as CommunityReviewWithGame[])])
    if (data.length < 20) setHasMore(false)
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {reviews.map((review) => {
          const sc = scoreColor(review.score ?? 0)
          return (
            <Link key={review.id} href={`/games/${review.games?.slug}`} style={{ textDecoration: "none", display: "flex", gap: "14px", background: "rgba(109,40,217,0.03)", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ width: "44px", height: "60px", borderRadius: "8px", background: "rgba(109,40,217,0.08)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {review.games?.cover_url
                  ? <img src={review.games.cover_url} alt={review.games.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ color: "#7c3aed", fontWeight: 700 }}>{review.games?.title[0]}</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b" }}>{review.games?.title}</p>
                    <p style={{ fontSize: "11px", color: "#9d8fc0" }}>By {review.username} · {review.created_at ? formatDate(review.created_at) : ""}</p>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: sc.color, background: sc.bg, padding: "3px 8px", borderRadius: "6px", flexShrink: 0 }}>{review.score}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{review.body}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {hasMore && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button onClick={loadMore} disabled={loading}
            style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", padding: "10px 28px", borderRadius: "8px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, width: "100%", maxWidth: "300px" }}>
            {loading ? "Loading…" : "Load more reviews"}
          </button>
        </div>
      )}
    </>
  )
}
