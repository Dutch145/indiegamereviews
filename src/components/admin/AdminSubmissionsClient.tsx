"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"

interface Submission {
  id: string
  developer_name: string
  discord: string
  game_title: string
  release_status: string
  platforms: string
  store_link: string | null
  genres: string | null
  playtime: string | null
  description: string
  trailer_link: string | null
  screenshots_link: string | null
  review_keys: string | null
  embargo_date: string | null
  press_kit_link: string | null
  status: string
  created_at: string
}

const box: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(109,40,217,0.1)",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(109,40,217,0.05)",
  marginBottom: "10px",
}

const statusStyle = (status: string): React.CSSProperties => {
  if (status === "approved") return { fontSize: "11px", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", padding: "3px 10px", borderRadius: "20px" }
  if (status === "rejected") return { fontSize: "11px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", padding: "3px 10px", borderRadius: "20px" }
  return { fontSize: "11px", fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", padding: "3px 10px", borderRadius: "20px" }
}

const linkStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, color: "#7c3aed", textDecoration: "none",
  background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)",
  padding: "4px 10px", borderRadius: "6px", display: "inline-block",
}

export function AdminSubmissionsClient({ submissions: initial }: { submissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function updateStatus(id: string, status: string) {
    if (!confirm(`Mark this submission as ${status}?`)) return
    setLoading(id)
    await (supabase as any).from("developer_submissions").update({ status }).eq("id", id)
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s))
    setLoading(null)
  }

  const pending = submissions.filter((s) => s.status === "pending")
  const reviewed = submissions.filter((s) => s.status !== "pending")

  const SubCard = ({ sub }: { sub: Submission }) => {
    const isExpanded = expanded === sub.id
    return (
      <div style={box}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e1b4b", marginBottom: "2px" }}>{sub.game_title}</p>
              <p style={{ fontSize: "12px", color: "#9d8fc0" }}>by {sub.developer_name} · Discord: {sub.discord} · {formatDate(sub.created_at)}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "3px 8px", borderRadius: "6px" }}>{sub.release_status}</span>
              <span style={statusStyle(sub.status)}>{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "10px" }}>
            {[["Platforms", sub.platforms], ["Genres", sub.genres ?? "—"], ["Playtime", sub.playtime ?? "—"]].map(([label, val]) => (
              <div key={String(label)} style={{ background: "rgba(109,40,217,0.03)", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "8px", padding: "8px 12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#9d8fc0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</p>
                <p style={{ fontSize: "12px", color: "#3d3580", fontWeight: 600 }}>{val}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "13px", color: "#3d3580", lineHeight: 1.7, marginBottom: "10px", display: isExpanded ? "block" : "-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 2, WebkitBoxOrient: "vertical", overflow: isExpanded ? "visible" : "hidden" } as React.CSSProperties}>
            {sub.description}
          </p>

          {isExpanded && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              {sub.store_link && <a href={sub.store_link} target="_blank" rel="noopener noreferrer" style={linkStyle}>Store page →</a>}
              {sub.trailer_link && <a href={sub.trailer_link} target="_blank" rel="noopener noreferrer" style={linkStyle}>Trailer →</a>}
              {sub.screenshots_link && <a href={sub.screenshots_link} target="_blank" rel="noopener noreferrer" style={linkStyle}>Screenshots →</a>}
              {sub.press_kit_link && <a href={sub.press_kit_link} target="_blank" rel="noopener noreferrer" style={linkStyle}>Press kit →</a>}
              {sub.review_keys && <span style={{ fontSize: "12px", color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "4px 10px", borderRadius: "6px" }}>🔑 {sub.review_keys}</span>}
              {sub.embargo_date && <span style={{ fontSize: "12px", color: "#d97706", background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", padding: "4px 10px", borderRadius: "6px" }}>Embargo: {sub.embargo_date}</span>}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setExpanded(isExpanded ? null : sub.id)} style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
              {isExpanded ? "Show less" : "View details"}
            </button>
            {sub.status === "pending" && (
              <>
                <button onClick={() => updateStatus(sub.id, "approved")} disabled={loading === sub.id} style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #059669, #10b981)", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: loading === sub.id ? "default" : "pointer", opacity: loading === sub.id ? 0.7 : 1 }}>
                  {loading === sub.id ? "..." : "Accept"}
                </button>
                <button onClick={() => updateStatus(sub.id, "rejected")} disabled={loading === sub.id} style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", padding: "7px 14px", borderRadius: "6px", cursor: loading === sub.id ? "default" : "pointer" }}>
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (submissions.length === 0) return (
    <div style={{ ...box, padding: "48px", textAlign: "center" }}>
      <p style={{ fontSize: "14px", color: "#9d8fc0" }}>No developer submissions yet.</p>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {pending.length > 0 && (
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b", marginBottom: "10px" }}>
            Pending <span style={{ color: "#d97706", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", marginLeft: "6px" }}>{pending.length}</span>
          </p>
          {pending.map((s) => <SubCard key={s.id} sub={s} />)}
        </div>
      )}
      {reviewed.length > 0 && (
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#6d60c0", marginBottom: "10px" }}>Previously reviewed ({reviewed.length})</p>
          {reviewed.map((s) => <SubCard key={s.id} sub={s} />)}
        </div>
      )}
    </div>
  )
}