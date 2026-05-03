"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatDate, scoreColor } from "@/lib/utils"
import type { Profile } from "@/types/database"

interface Draft {
  id: string
  game_id: string
  author_name: string
  summary: string
  verdict: string
  score_overall: number
  status: string
  admin_notes: string | null
  created_at: string
  games: { title: string; slug: string } | null
}

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

const statusStyle = (status: string): React.CSSProperties => {
  if (status === "approved") return { fontSize: "11px", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", padding: "3px 10px", borderRadius: "20px" }
  if (status === "rejected") return { fontSize: "11px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", padding: "3px 10px", borderRadius: "20px" }
  return { fontSize: "11px", fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", padding: "3px 10px", borderRadius: "20px" }
}

export default function MyDraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const { data: profileData } = await supabase.from("profiles").select("is_reviewer, is_admin").eq("id", user.id).single()
      const p = profileData as unknown as Pick<Profile, "is_reviewer" | "is_admin"> | null
      if (!p || (!p.is_reviewer && !p.is_admin)) { router.push("/"); return }

      const { data } = await supabase.from("review_drafts").select("*, games(title, slug)").order("created_at", { ascending: false })
      setDrafts((data ?? []) as unknown as Draft[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ textAlign: "center", paddingTop: "60px", color: "#6d60c0" }}>Loading...</div>

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={box}>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>← Back to home</Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e1b4b", marginBottom: "4px", letterSpacing: "-0.5px" }}>My review drafts</h1>
            <p style={{ fontSize: "14px", color: "#6d60c0" }}>{drafts.length} draft{drafts.length !== 1 ? "s" : ""} submitted</p>
          </div>
          <Link href="/submit-review" style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", padding: "9px 16px", borderRadius: "8px", textDecoration: "none" }}>+ New review</Link>
        </div>
      </div>

      {drafts.length === 0 ? (
        <div style={{ ...box, textAlign: "center", padding: "48px" }}>
          <p style={{ fontSize: "15px", color: "#9d8fc0", marginBottom: "16px" }}>No drafts yet.</p>
          <Link href="/submit-review" style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none" }}>Write your first review</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {drafts.map((draft) => {
            const sc = scoreColor(draft.score_overall)
            return (
              <div key={draft.id} style={box}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#1e1b4b", marginBottom: "3px" }}>{draft.games?.title ?? "Unknown game"}</p>
                    <p style={{ fontSize: "12px", color: "#9d8fc0" }}>Submitted {formatDate(draft.created_at)}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: sc.color, background: sc.bg, padding: "3px 8px", borderRadius: "6px" }}>{draft.score_overall}</span>
                    <span style={statusStyle(draft.status)}>{draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}</span>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6, marginBottom: draft.admin_notes ? "12px" : "0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                  {draft.summary}
                </p>
                {draft.admin_notes && (
                  <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderLeft: "3px solid #7c3aed", borderRadius: "8px", padding: "10px 14px", marginTop: "10px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Editor notes</p>
                    <p style={{ fontSize: "13px", color: "#3d3580", lineHeight: 1.6 }}>{draft.admin_notes}</p>
                  </div>
                )}
                {draft.status === "approved" && draft.games?.slug && (
                  <div style={{ marginTop: "10px" }}>
                    <Link href={`/games/${draft.games.slug}`} style={{ fontSize: "13px", fontWeight: 600, color: "#059669", textDecoration: "none" }}>View published review →</Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}