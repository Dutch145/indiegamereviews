"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate, scoreColor } from "@/lib/utils"

interface Draft {
  id: string
  game_id: string    // ← add this line
  author_name: string
  author_id: string
  summary: string
  verdict: string
  score_overall: number
  score_gameplay: number | null
  score_visuals: number | null
  score_replayability: number | null
  score_audio: number | null
  status: string
  admin_notes: string | null
  created_at: string
  games: { title: string; slug: string } | null
  profiles: { username: string } | null
}

interface Props { drafts: Draft[] }

const statusStyle = (status: string): React.CSSProperties => {
  if (status === "approved") return { fontSize: "11px", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", padding: "3px 10px", borderRadius: "20px" }
  if (status === "rejected") return { fontSize: "11px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", padding: "3px 10px", borderRadius: "20px" }
  return { fontSize: "11px", fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", padding: "3px 10px", borderRadius: "20px" }
}

export function AdminDraftsClient({ drafts: initial }: Props) {
  const [drafts, setDrafts] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function handleApprove(draft: Draft) {
    if (!confirm(`Approve and publish "${draft.games?.title}" review by ${draft.author_name}?`)) return
    setLoading(draft.id)

    // Publish to editor_reviews
    const { error } = await supabase.from("editor_reviews").insert({
      game_id: draft.game_id,
      author: draft.author_name,
      summary: draft.summary,
      verdict: draft.verdict,
      score_overall: draft.score_overall,
      score_gameplay: draft.score_gameplay,
      score_visuals: draft.score_visuals,
      score_replayability: draft.score_replayability,
      score_audio: draft.score_audio,
    } as any)

    if (error) { alert("Error publishing: " + error.message); setLoading(null); return }

    // Update draft status
    await supabase.from("review_drafts").update({ status: "approved", admin_notes: notes[draft.id] || null }).eq("id", draft.id)
    setDrafts((prev) => prev.map((d) => d.id === draft.id ? { ...d, status: "approved" } : d))
    setLoading(null)
  }

  async function handleReject(draft: Draft) {
    if (!notes[draft.id]?.trim()) { alert("Please add a note explaining why the review is being rejected."); return }
    if (!confirm(`Reject this review?`)) return
    setLoading(draft.id)
    await supabase.from("review_drafts").update({ status: "rejected", admin_notes: notes[draft.id] }).eq("id", draft.id)
    setDrafts((prev) => prev.map((d) => d.id === draft.id ? { ...d, status: "rejected", admin_notes: notes[draft.id] } : d))
    setLoading(null)
  }

  const pending = drafts.filter((d) => d.status === "pending")
  const reviewed = drafts.filter((d) => d.status !== "pending")

  const DraftCard = ({ draft }: { draft: Draft }) => {
    const sc = scoreColor(draft.score_overall)
    const isExpanded = expanded === draft.id

    return (
      <div style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.1)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(109,40,217,0.05)" }}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e1b4b", marginBottom: "2px" }}>{draft.games?.title ?? "—"}</p>
              <p style={{ fontSize: "12px", color: "#9d8fc0" }}>By {draft.author_name} · {formatDate(draft.created_at)}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: sc.color, background: sc.bg, padding: "3px 8px", borderRadius: "6px" }}>{draft.score_overall}</span>
              <span style={statusStyle(draft.status)}>{draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}</span>
            </div>
          </div>

          <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6, marginBottom: "12px", display: isExpanded ? "block" : "-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 3, WebkitBoxOrient: "vertical", overflow: isExpanded ? "visible" : "hidden" } as React.CSSProperties}>
            {draft.summary}
          </p>

          {isExpanded && (
            <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderLeft: "3px solid #7c3aed", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", marginBottom: "4px" }}>Verdict</p>
              <p style={{ fontSize: "13px", color: "#3d3580" }}>{draft.verdict}</p>
            </div>
          )}

          {isExpanded && draft.score_gameplay !== null && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "12px" }}>
              {[["Gameplay", draft.score_gameplay], ["Visuals", draft.score_visuals], ["Replayability", draft.score_replayability], ["Audio", draft.score_audio]].map(([label, val]) => val !== null ? (
                <div key={String(label)} style={{ textAlign: "center", background: "rgba(109,40,217,0.03)", borderRadius: "8px", padding: "8px" }}>
                  <p style={{ fontSize: "10px", color: "#9d8fc0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</p>
                  <p style={{ fontSize: "16px", fontWeight: 800, color: "#7c3aed" }}>{val}</p>
                </div>
              ) : null)}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setExpanded(isExpanded ? null : draft.id)} style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
              {isExpanded ? "Show less" : "Read full review"}
            </button>

            {draft.status === "pending" && (
              <>
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <input
                    type="text"
                    placeholder="Admin notes (required for rejection)"
                    value={notes[draft.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [draft.id]: e.target.value }))}
                    style={{ width: "100%", fontSize: "12px", background: "#faf8ff", border: "1px solid rgba(109,40,217,0.15)", borderRadius: "6px", padding: "6px 10px", color: "#1e1b4b", outline: "none" }}
                  />
                </div>
                <button onClick={() => handleApprove(draft)} disabled={loading === draft.id} style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #059669, #10b981)", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: loading === draft.id ? "default" : "pointer", opacity: loading === draft.id ? 0.7 : 1 }}>
                  {loading === draft.id ? "..." : "Approve & Publish"}
                </button>
                <button onClick={() => handleReject(draft)} disabled={loading === draft.id} style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", padding: "7px 14px", borderRadius: "6px", cursor: loading === draft.id ? "default" : "pointer" }}>
                  Reject
                </button>
              </>
            )}

            {draft.admin_notes && (
              <p style={{ fontSize: "12px", color: "#6d60c0", fontStyle: "italic" }}>Note: {draft.admin_notes}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b" }}>Pending review <span style={{ color: "#d97706", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", marginLeft: "6px" }}>{pending.length}</span></p>
        </div>
        {pending.length === 0
          ? <p style={{ fontSize: "14px", color: "#9d8fc0", padding: "20px 0" }}>No pending drafts.</p>
          : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{pending.map((d) => <DraftCard key={d.id} draft={d} />)}</div>
        }
      </div>

      {reviewed.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "3px", height: "14px", background: "rgba(109,40,217,0.2)", borderRadius: "2px" }} />
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#6d60c0" }}>Previously reviewed ({reviewed.length})</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{reviewed.map((d) => <DraftCard key={d.id} draft={d} />)}</div>
        </div>
      )}
    </div>
  )
}