"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"

interface Application {
  id: string
  username: string
  discord: string
  platforms: string
  genres: string
  monthly_reviews: string
  experience: string | null
  sample_title: string
  hours_played: number | null
  score: number | null
  pros: string[] | null
  cons: string[] | null
  review_body: string
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

export function AdminApplicationsClient({ applications: initial }: { applications: Application[] }) {
  const [applications, setApplications] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function handleApprove(app: Application) {
    if (!confirm(`Approve ${app.username} as a reviewer? This will grant them reviewer access on the site.`)) return
    setLoading(app.id)
    const res = await fetch("/api/admin/update-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: app.id, status: "approved", username: app.username }),
    })
    if (!res.ok) { alert("Failed to approve. Check console."); setLoading(null); return }
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "approved" } : a))
    setLoading(null)
  }

  async function handleReject(app: Application) {
    if (!confirm(`Reject ${app.username}'s application?`)) return
    setLoading(app.id)
    const res = await fetch("/api/admin/update-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: app.id, status: "rejected", username: app.username }),
    })
    if (!res.ok) { alert("Failed to reject. Check console."); setLoading(null); return }
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "rejected" } : a))
    setLoading(null)
  }

  const pending = applications.filter((a) => a.status === "pending")
  const reviewed = applications.filter((a) => a.status !== "pending")

  const AppCard = ({ app }: { app: Application }) => {
    const isExpanded = expanded === app.id
    return (
      <div style={box}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e1b4b", marginBottom: "2px" }}>{app.username}</p>
              <p style={{ fontSize: "12px", color: "#9d8fc0" }}>Discord: {app.discord} · Submitted {formatDate(app.created_at)}</p>
            </div>
            <span style={statusStyle(app.status)}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
            {[["Platforms", app.platforms], ["Genres", app.genres], ["Reviews/month", app.monthly_reviews]].map(([label, val]) => (
              <div key={String(label)} style={{ background: "rgba(109,40,217,0.03)", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "8px", padding: "8px 12px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#9d8fc0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</p>
                <p style={{ fontSize: "12px", color: "#3d3580", fontWeight: 600 }}>{val}</p>
              </div>
            ))}
          </div>

          {app.experience && (
            <div style={{ marginBottom: "10px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#6d60c0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Prior experience</p>
              <p style={{ fontSize: "13px", color: "#3d3580" }}>{app.experience}</p>
            </div>
          )}

          {isExpanded && (
            <>
              <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>Sample: {app.sample_title}</p>
                  {app.hours_played && <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{app.hours_played}hrs played</p>}
                  {app.score && <p style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>Score: {app.score}</p>}
                </div>

                {(app.pros?.length || app.cons?.length) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                    {app.pros && app.pros.length > 0 && (
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: 700, color: "#059669", textTransform: "uppercase", marginBottom: "4px" }}>Pros</p>
                        {app.pros.map((p, i) => <p key={i} style={{ fontSize: "12px", color: "#065f46" }}>+ {p}</p>)}
                      </div>
                    )}
                    {app.cons && app.cons.length > 0 && (
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", marginBottom: "4px" }}>Cons</p>
                        {app.cons.map((c, i) => <p key={i} style={{ fontSize: "12px", color: "#7f1d1d" }}>- {c}</p>)}
                      </div>
                    )}
                  </div>
                )}
                <p style={{ fontSize: "13px", color: "#3d3580", lineHeight: 1.7 }}>{app.review_body}</p>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setExpanded(isExpanded ? null : app.id)} style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
              {isExpanded ? "Show less" : "Read sample review"}
            </button>
            {app.status === "pending" && (
              <>
                <button onClick={() => handleApprove(app)} disabled={loading === app.id} style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #059669, #10b981)", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: loading === app.id ? "default" : "pointer", opacity: loading === app.id ? 0.7 : 1 }}>
                  {loading === app.id ? "..." : "Approve & Grant Reviewer"}
                </button>
                <button onClick={() => handleReject(app)} disabled={loading === app.id} style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", padding: "7px 14px", borderRadius: "6px", cursor: loading === app.id ? "default" : "pointer" }}>
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (applications.length === 0) return (
    <div style={{ ...box, padding: "48px", textAlign: "center" }}>
      <p style={{ fontSize: "14px", color: "#9d8fc0" }}>No reviewer applications yet.</p>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {pending.length > 0 && (
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b", marginBottom: "10px" }}>
            Pending <span style={{ color: "#d97706", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", marginLeft: "6px" }}>{pending.length}</span>
          </p>
          {pending.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      )}
      {reviewed.length > 0 && (
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#6d60c0", marginBottom: "10px" }}>Previously reviewed ({reviewed.length})</p>
          {reviewed.map((a) => <AppCard key={a.id} app={a} />)}
        </div>
      )}
    </div>
  )
}