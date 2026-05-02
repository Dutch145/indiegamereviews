"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { CommunityReviewWithVotes } from "@/types/database"
import { scoreColor, formatDate } from "@/lib/utils"

interface Props {
  review: CommunityReviewWithVotes
  isOwn: boolean
  currentUserId: string | null
}

export function CommunityReviewCard({ review, isOwn, currentUserId }: Props) {
  const [helpfulYes, setHelpfulYes] = useState<number>(review.helpful_yes ?? 0)
  const [helpfulNo, setHelpfulNo] = useState<number>(review.helpful_no ?? 0)
  const [voted, setVoted] = useState(false)
  const [flagged, setFlagged] = useState(false)
  const supabase = createClient()
  const sc = scoreColor(review.score ?? 0)

  async function vote(helpful: boolean) {
    if (!currentUserId || voted) return
    await supabase.from("helpful_votes").upsert({ review_id: review.id!, user_id: currentUserId, helpful })
    if (helpful) setHelpfulYes((v: number) => v + 1)
    else setHelpfulNo((v: number) => v + 1)
    setVoted(true)
  }

  async function flagReview() {
    if (!currentUserId || flagged) return
    await supabase.from("flagged_reviews").upsert({ review_id: review.id!, flagged_by: currentUserId, reason: null })
    setFlagged(true)
  }

  const initials = (review.username ?? "??").slice(0, 2).toUpperCase()
  const hasPros = review.pros && review.pros.length > 0
  const hasCons = review.cons && review.cons.length > 0

  return (
    <div style={{ paddingTop: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(109,40,217,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#7c3aed", flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e1b4b" }}>
            {review.username ?? "Anonymous"}
            {isOwn && <span style={{ fontSize: "11px", color: "#9d8fc0", fontWeight: 400, marginLeft: "6px" }}>(you)</span>}
          </p>
          <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{review.created_at ? formatDate(review.created_at) : ""}</p>
        </div>
        <div style={{ padding: "4px 10px", borderRadius: "8px", background: sc.bg, border: `1px solid ${sc.color}33`, fontSize: "14px", fontWeight: 700, color: sc.color }}>
          {review.score}
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "#3d3580", lineHeight: 1.7, marginBottom: hasPros || hasCons ? "12px" : "0" }}>{review.body}</p>

      {(hasPros || hasCons) && (
        <div style={{ display: "grid", gridTemplateColumns: hasPros && hasCons ? "1fr 1fr" : "1fr", gap: "10px", marginBottom: "12px" }}>
          {hasPros && (
            <div style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Pros</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                {review.pros!.map((pro: string, i: number) => (
                  <li key={i} style={{ fontSize: "13px", color: "#065f46", display: "flex", gap: "6px" }}>
                    <span style={{ color: "#10b981" }}>+</span>{pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasCons && (
            <div style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Cons</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                {review.cons!.map((con: string, i: number) => (
                  <li key={i} style={{ fontSize: "13px", color: "#7f1d1d", display: "flex", gap: "6px" }}>
                    <span style={{ color: "#f87171" }}>−</span>{con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!isOwn && currentUserId && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
          <span style={{ fontSize: "11px", color: "#9d8fc0" }}>Helpful?</span>
          <button onClick={() => vote(true)} disabled={voted} style={{ fontSize: "11px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "4px 10px", borderRadius: "6px", cursor: voted ? "default" : "pointer", opacity: voted ? 0.5 : 1 }}>Yes ({helpfulYes})</button>
          <button onClick={() => vote(false)} disabled={voted} style={{ fontSize: "11px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "4px 10px", borderRadius: "6px", cursor: voted ? "default" : "pointer", opacity: voted ? 0.5 : 1 }}>No ({helpfulNo})</button>
          <button onClick={flagReview} disabled={flagged} style={{ marginLeft: "auto", fontSize: "11px", color: flagged ? "#fbbf24" : "#c4b5fd", background: "none", border: "none", cursor: flagged ? "default" : "pointer" }}>{flagged ? "Flagged" : "Flag"}</button>
        </div>
      )}
    </div>
  )
}