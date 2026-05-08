"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { CommunityReviewWithVotes } from "@/types/database"
import { scoreColor, formatDate } from "@/lib/utils"
import { ReviewComments } from "./ReviewComments"

interface Props {
  review: CommunityReviewWithVotes
  isOwn: boolean
  currentUserId: string | null
  currentUsername?: string | null
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: "13px", background: "#faf8ff",
  border: "1px solid rgba(109,40,217,0.2)", borderRadius: "8px",
  padding: "8px 12px", outline: "none", fontFamily: "inherit",
  color: "#1e1b4b",
}

export function CommunityReviewCard({ review, isOwn, currentUserId, currentUsername = null }: Props) {
  const supabase = createClient()
  const sc = scoreColor(review.score ?? 0)

  // Helpfulness / flag state
  const [helpfulYes, setHelpfulYes] = useState<number>(review.helpful_yes ?? 0)
  const [helpfulNo, setHelpfulNo]   = useState<number>(review.helpful_no ?? 0)
  const [voted, setVoted]     = useState(false)
  const [flagged, setFlagged] = useState(false)

  // Displayed content (updated after a successful edit)
  const [displayBody,  setDisplayBody]  = useState(review.body ?? "")
  const [displayScore, setDisplayScore] = useState(review.score ?? 5)
  const [displayPros,  setDisplayPros]  = useState<string[]>(review.pros ?? [])
  const [displayCons,  setDisplayCons]  = useState<string[]>(review.cons ?? [])

  // Edit mode
  const [editing,   setEditing]   = useState(false)
  const [editBody,  setEditBody]  = useState("")
  const [editScore, setEditScore] = useState(5)
  const [editPros,  setEditPros]  = useState(["", "", ""])
  const [editCons,  setEditCons]  = useState(["", "", ""])
  const [saving,    setSaving]    = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  function startEdit() {
    setEditBody(displayBody)
    setEditScore(displayScore)
    setEditPros([...displayPros, "", "", ""].slice(0, 3))
    setEditCons([...displayCons, "", "", ""].slice(0, 3))
    setEditing(true)
    setEditError(null)
  }

  async function saveEdit() {
    if (!editBody.trim()) { setEditError("Review body is required."); return }
    setSaving(true)
    setEditError(null)
    const { error } = await supabase.from("community_reviews").update({
      body: editBody.trim(),
      score: editScore,
      pros: editPros.map((p) => p.trim()).filter(Boolean),
      cons: editCons.map((c) => c.trim()).filter(Boolean),
    }).eq("id", review.id!)
    setSaving(false)
    if (error) { setEditError(error.message); return }
    setDisplayBody(editBody.trim())
    setDisplayScore(editScore)
    setDisplayPros(editPros.map((p) => p.trim()).filter(Boolean))
    setDisplayCons(editCons.map((c) => c.trim()).filter(Boolean))
    setEditing(false)
  }

  async function vote(helpful: boolean) {
    if (!currentUserId || voted) return
    await supabase.from("helpful_votes").upsert({ review_id: review.id!, user_id: currentUserId, helpful })
    if (helpful) setHelpfulYes((v) => v + 1)
    else setHelpfulNo((v) => v + 1)
    setVoted(true)
  }

  async function flagReview() {
    if (!currentUserId || flagged) return
    await supabase.from("flagged_reviews").upsert({ review_id: review.id!, flagged_by: currentUserId, reason: null })
    setFlagged(true)
  }

  const initials   = (review.username ?? "??").slice(0, 2).toUpperCase()
  const hasPros    = displayPros.length > 0
  const hasCons    = displayCons.length > 0
  const displaySc  = scoreColor(displayScore)

  return (
    <div style={{ paddingTop: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(109,40,217,0.08)" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#7c3aed", flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e1b4b" }}>
            {review.username
              ? <Link href={`/user/${encodeURIComponent(review.username)}`} style={{ color: "#1e1b4b", textDecoration: "none" }} className="hover:text-indigo-600">{review.username}</Link>
              : "Anonymous"
            }
            {isOwn && <span style={{ fontSize: "11px", color: "#9d8fc0", fontWeight: 400, marginLeft: "6px" }}>(you)</span>}
          </p>
          <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{review.created_at ? formatDate(review.created_at) : ""}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ padding: "4px 10px", borderRadius: "8px", background: displaySc.bg, border: `1px solid ${displaySc.color}33`, fontSize: "14px", fontWeight: 700, color: displaySc.color }}>
            {displayScore}
          </div>
          {isOwn && !editing && (
            <button onClick={startEdit} style={{ fontSize: "11px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer" }}>
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        /* ── Edit form ── */
        <div style={{ background: "rgba(124,58,237,0.03)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0", flexShrink: 0 }}>Score</label>
            <input type="range" min={0} max={10} step={0.5} value={editScore}
              onChange={(e) => setEditScore(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#7c3aed" }}
            />
            <span style={{ fontSize: "14px", fontWeight: 700, color: scoreColor(editScore).color, width: "28px", textAlign: "right" }}>{editScore}</span>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0", display: "block", marginBottom: "4px" }}>Review</label>
            <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={4}
              style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#059669", display: "block", marginBottom: "4px" }}>Pros</label>
              {editPros.map((p, i) => (
                <input key={i} value={p} placeholder={`Pro ${i + 1}`}
                  onChange={(e) => setEditPros((prev) => { const n = [...prev]; n[i] = e.target.value; return n })}
                  style={{ ...inputStyle, marginBottom: i < 2 ? "6px" : 0 }}
                />
              ))}
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#dc2626", display: "block", marginBottom: "4px" }}>Cons</label>
              {editCons.map((c, i) => (
                <input key={i} value={c} placeholder={`Con ${i + 1}`}
                  onChange={(e) => setEditCons((prev) => { const n = [...prev]; n[i] = e.target.value; return n })}
                  style={{ ...inputStyle, marginBottom: i < 2 ? "6px" : 0 }}
                />
              ))}
            </div>
          </div>

          {editError && <p style={{ fontSize: "12px", color: "#dc2626" }}>{editError}</p>}

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={saveEdit} disabled={saving}
              style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", padding: "8px 16px", borderRadius: "7px", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button onClick={() => setEditing(false)}
              style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0", background: "none", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── Normal view ── */
        <>
          <p style={{ fontSize: "14px", color: "#3d3580", lineHeight: 1.7, marginBottom: hasPros || hasCons ? "12px" : "0" }}>{displayBody}</p>

          {(hasPros || hasCons) && (
            <div style={{ display: "grid", gridTemplateColumns: hasPros && hasCons ? "1fr 1fr" : "1fr", gap: "10px", marginBottom: "12px" }}>
              {hasPros && (
                <div style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Pros</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                    {displayPros.map((pro, i) => <li key={i} style={{ fontSize: "13px", color: "#065f46", display: "flex", gap: "6px" }}><span style={{ color: "#10b981" }}>+</span>{pro}</li>)}
                  </ul>
                </div>
              )}
              {hasCons && (
                <div style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Cons</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                    {displayCons.map((con, i) => <li key={i} style={{ fontSize: "13px", color: "#7f1d1d", display: "flex", gap: "6px" }}><span style={{ color: "#f87171" }}>−</span>{con}</li>)}
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
          <ReviewComments reviewId={review.id!} currentUserId={currentUserId} currentUsername={currentUsername} />
        </>
      )}
    </div>
  )
}
