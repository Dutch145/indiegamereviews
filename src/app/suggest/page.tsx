"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type Request = { id: string; title: string; votes: number; created_at: string; user_id: string }

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

export default function SuggestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadRequests()
  }, [])

  async function loadRequests() {
    const { data } = await supabase.from("game_requests").select("*").order("votes", { ascending: false })
    setRequests((data ?? []) as unknown as Request[])
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: votes } = await supabase.from("game_request_votes").select("request_id").eq("user_id", user.id)
      if (votes) setVotedIds(new Set(votes.map((v: { request_id: string }) => v.request_id)))
    }
  }

  async function handleSubmit() {
    if (!title.trim()) { setError("Please enter a game title."); return }
    if (!user) { router.push("/auth/login"); return }
    setLoading(true); setError(null)
    const { error: err } = await supabase.from("game_requests").insert({ title: title.trim(), user_id: user.id })
    setLoading(false)
    if (err) { setError(err.message.includes("unique") ? "This game has already been requested. Upvote it below!" : err.message); return }
    setTitle(""); setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    loadRequests()
  }

  async function handleVote(requestId: string) {
    if (!user) { router.push("/auth/login"); return }
    if (votedIds.has(requestId)) {
      await supabase.from("game_request_votes").delete().eq("request_id", requestId).eq("user_id", user.id)
      const current = requests.find((r) => r.id === requestId)?.votes ?? 1
      await supabase.from("game_requests").update({ votes: current - 1 }).eq("id", requestId)
      setVotedIds((prev) => { const next = new Set(prev); next.delete(requestId); return next })
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, votes: r.votes - 1 } : r).sort((a, b) => b.votes - a.votes))
    } else {
      await supabase.from("game_request_votes").insert({ request_id: requestId, user_id: user.id })
      const current = requests.find((r) => r.id === requestId)?.votes ?? 0
      await supabase.from("game_requests").update({ votes: current + 1 }).eq("id", requestId)
      setVotedIds((prev) => new Set([...prev, requestId]))
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, votes: r.votes + 1 } : r).sort((a, b) => b.votes - a.votes))
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={box}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "6px" }}>Suggest a game</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>Request a game you want us to review. Upvote others to help us prioritise.</p>
      </div>

      {user ? (
        <div style={box}>
          <label style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#6d60c0", display: "block", marginBottom: "10px" }}>Game title</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="e.g. Hades, Celeste, Hollow Knight..." style={{ flex: 1, fontSize: "14px", background: "#faf8ff", border: "1px solid rgba(109,40,217,0.15)", borderRadius: "10px", padding: "11px 14px", color: "#1e1b4b", outline: "none", minWidth: 0 }} />
            <button onClick={handleSubmit} disabled={loading} style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "11px 18px", borderRadius: "10px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap", flexShrink: 0 }}>
              {loading ? "..." : "Submit"}
            </button>
          </div>
          {error && <p style={{ fontSize: "13px", color: "#dc2626", marginTop: "8px" }}>{error}</p>}
          {success && <p style={{ fontSize: "13px", color: "#059669", marginTop: "8px" }}>Submitted! Thanks for the suggestion.</p>}
        </div>
      ) : (
        <div style={{ ...box, textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#6d60c0", marginBottom: "14px" }}>Sign in to suggest and vote on games</p>
          <a href="/auth/login" style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", display: "inline-block" }}>Sign in</a>
        </div>
      )}

      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>All requests · {requests.length}</p>
        </div>
        {requests.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#9d8fc0", textAlign: "center", padding: "32px 0" }}>No requests yet — be the first!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {requests.map((request, i) => (
              <div key={request.id} style={{ background: "rgba(109,40,217,0.03)", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(109,40,217,0.25)", width: "18px", textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                <p style={{ flex: 1, fontSize: "14px", fontWeight: 600, color: "#1e1b4b", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{request.title}</p>
                <button onClick={() => handleVote(request.id)} disabled={!user} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: 700, padding: "6px 12px", borderRadius: "8px", cursor: user ? "pointer" : "default", border: "none", background: votedIds.has(request.id) ? "rgba(124,58,237,0.15)" : "rgba(109,40,217,0.06)", color: votedIds.has(request.id) ? "#7c3aed" : "#9d8fc0", opacity: !user ? 0.4 : 1, flexShrink: 0 }}>
                  <span>▲</span><span>{request.votes}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}