"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Game, Profile } from "@/types/database"

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: "14px",
  background: "#faf8ff",
  border: "1px solid rgba(109,40,217,0.15)",
  borderRadius: "8px", padding: "11px 14px",
  color: "#1e1b4b", outline: "none",
  fontFamily: "inherit",
}

const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 700,
  color: "#6d60c0", display: "block",
  marginBottom: "6px", textTransform: "uppercase",
  letterSpacing: "0.5px",
}

const scoreFields = [
  { key: "score_gameplay", label: "Gameplay" },
  { key: "score_visuals", label: "Visuals" },
  { key: "score_replayability", label: "Replayability" },
  { key: "score_audio", label: "Audio" },
]

export default function SubmitReviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [gameId, setGameId] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [summary, setSummary] = useState("")
  const [verdict, setVerdict] = useState("")
  const [scoreOverall, setScoreOverall] = useState("8.0")
  const [subScores, setSubScores] = useState({ score_gameplay: "", score_visuals: "", score_replayability: "", score_audio: "" })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      const p = profileData as unknown as Profile | null

      if (!p || (!p.is_reviewer && !p.is_admin)) {
        router.push("/")
        return
      }

      setProfile(p)
      setAuthorName(p.username)

      const { data: gamesData } = await supabase.from("games").select("id, title, slug").order("title")
      setGames((gamesData ?? []) as unknown as Game[])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit() {
    if (!gameId || !authorName.trim() || !summary.trim() || !verdict.trim()) {
      setError("Please fill in all required fields."); return
    }
    if (summary.split(" ").filter(Boolean).length < 50) {
      setError("Review body should be at least 50 words."); return
    }
    setSubmitting(true); setError(null)

    const { error: err } = await supabase.from("review_drafts").insert({
      game_id: gameId,
      author_id: profile!.id,
      author_name: authorName.trim(),
      summary: summary.trim(),
      verdict: verdict.trim(),
      score_overall: parseFloat(scoreOverall),
      score_gameplay: subScores.score_gameplay ? parseFloat(subScores.score_gameplay) : null,
      score_visuals: subScores.score_visuals ? parseFloat(subScores.score_visuals) : null,
      score_replayability: subScores.score_replayability ? parseFloat(subScores.score_replayability) : null,
      score_audio: subScores.score_audio ? parseFloat(subScores.score_audio) : null,
    })

    setSubmitting(false)
    if (err) { setError(err.message); return }
    setSubmitted(true)
  }

  if (loading) return <div style={{ textAlign: "center", paddingTop: "60px", color: "#6d60c0" }}>Loading...</div>

  if (submitted) return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ ...box, textAlign: "center", padding: "48px" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</p>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", marginBottom: "10px" }}>Draft submitted!</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0", lineHeight: 1.7, marginBottom: "24px" }}>
          Your review has been submitted for editorial review. An admin will approve or provide feedback within a few days.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setSubmitted(false)} style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>Submit another</button>
          <Link href="/my-drafts" style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", padding: "10px 18px", borderRadius: "8px", textDecoration: "none" }}>View my drafts</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={box}>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>← Back to home</Link>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e1b4b", marginTop: "12px", marginBottom: "4px", letterSpacing: "-0.5px" }}>Submit a review</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>Write your review below. It will be reviewed by an editor before going live.</p>
      </div>

      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Review details</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Game *</label>
              <select style={inputStyle} value={gameId} onChange={(e) => setGameId(e.target.value)}>
                <option value="">Select a game...</option>
                {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Your name *</label>
              <input style={inputStyle} value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Display name for this review" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Overall score: <span style={{ color: "#7c3aed", fontWeight: 800 }}>{parseFloat(scoreOverall).toFixed(1)}</span></label>
            <input type="range" min={0} max={10} step={0.1} value={scoreOverall} onChange={(e) => setScoreOverall(e.target.value)} style={{ width: "100%", accentColor: "#7c3aed" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9d8fc0", marginTop: "2px" }}><span>0</span><span>10</span></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {scoreFields.map(({ key, label }) => (
              <div key={key}>
                <label style={labelStyle}>{label} (optional)</label>
                <input
                  style={inputStyle}
                  type="number" min={0} max={10} step={0.1}
                  value={subScores[key as keyof typeof subScores]}
                  onChange={(e) => setSubScores((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder="e.g. 8.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Review body</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Review body * <span style={{ color: "#9d8fc0", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(minimum 50 words)</span></label>
            <textarea
              style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
              rows={10}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your full review here. Cover gameplay, visuals, audio, replayability, and your overall impression..."
            />
            <p style={{ fontSize: "11px", color: "#9d8fc0", marginTop: "4px" }}>{summary.split(" ").filter(Boolean).length} words</p>
          </div>
          <div>
            <label style={labelStyle}>Verdict * <span style={{ color: "#9d8fc0", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(one closing sentence)</span></label>
            <textarea
              style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
              rows={2}
              value={verdict}
              onChange={(e) => setVerdict(e.target.value)}
              placeholder="A punchy one-sentence summary of your verdict..."
            />
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "12px", padding: "14px 18px" }}>
        <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6 }}>
          By submitting this review you confirm it is your original work based on your personal experience with the game. Reviews are subject to editorial approval before publishing.
        </p>
      </div>

      {error && <p style={{ fontSize: "13px", color: "#dc2626", paddingLeft: "4px" }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? "Submitting..." : "Submit for review"}
      </button>
    </div>
  )
}