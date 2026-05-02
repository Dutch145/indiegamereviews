"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Props {
  gameId: string
  userId: string
  onSuccess: () => void
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: "14px",
  background: "#faf8ff",
  border: "1px solid rgba(109,40,217,0.15)",
  borderRadius: "8px", padding: "10px 14px",
  color: "#1e1b4b", outline: "none",
}

export function ReviewForm({ gameId, userId, onSuccess }: Props) {
  const [score, setScore] = useState(8)
  const [body, setBody] = useState("")
  const [pros, setPros] = useState(["", "", ""])
  const [cons, setCons] = useState(["", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    if (!body.trim()) { setError("Please write a review."); return }
    setLoading(true); setError(null)
    const { error: err } = await supabase.from("community_reviews").insert({
      game_id: gameId, user_id: userId, score, body: body.trim(),
      review_type: "quick",
      pros: pros.map((p) => p.trim()).filter(Boolean),
      cons: cons.map((c) => c.trim()).filter(Boolean),
    })
    setLoading(false)
    if (err) { setError(err.message.includes("unique") || err.code === "23505" ? "You've already reviewed this game." : err.message); return }
    router.refresh(); onSuccess()
  }

  return (
    <div style={{ background: "#faf8ff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label style={{ fontSize: "12px", fontWeight: 700, color: "#6d60c0", display: "block", marginBottom: "8px" }}>
          Your score: <span style={{ color: "#7c3aed", fontWeight: 800 }}>{score}</span>
        </label>
        <input type="range" min={0} max={10} step={0.5} value={score} onChange={(e) => setScore(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9d8fc0", marginTop: "2px" }}><span>0</span><span>10</span></div>
      </div>
      <div>
        <label style={{ fontSize: "12px", fontWeight: 700, color: "#6d60c0", display: "block", marginBottom: "8px" }}>Your review</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Share your overall thoughts..." style={{ ...inputStyle, resize: "none" } as React.CSSProperties} />
      </div>
      <div>
        <label style={{ fontSize: "12px", fontWeight: 700, color: "#059669", display: "block", marginBottom: "8px" }}>+ Pros (optional)</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {pros.map((pro, i) => (
            <input key={i} type="text" value={pro} onChange={(e) => setPros((prev) => prev.map((p, j) => j === i ? e.target.value : p))} placeholder={`Pro ${i + 1}...`} style={{ ...inputStyle, borderColor: "rgba(52,211,153,0.3)" }} />
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626", display: "block", marginBottom: "8px" }}>− Cons (optional)</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {cons.map((con, i) => (
            <input key={i} type="text" value={con} onChange={(e) => setCons((prev) => prev.map((c, j) => j === i ? e.target.value : c))} placeholder={`Con ${i + 1}...`} style={{ ...inputStyle, borderColor: "rgba(248,113,113,0.3)" }} />
          ))}
        </div>
      </div>
      {error && <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading} style={{ fontSize: "14px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "12px", borderRadius: "10px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </div>
  )
}