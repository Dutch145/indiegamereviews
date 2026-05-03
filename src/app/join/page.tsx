"use client"

import { useState } from "react"
import Link from "next/link"

type Tab = "reviewer" | "developer"

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: "14px",
  background: "#faf8ff",
  border: "1px solid rgba(109,40,217,0.15)",
  borderRadius: "8px", padding: "11px 14px",
  color: "#1e1b4b", outline: "none",
  fontFamily: "inherit",
}

const textareaStyle: React.CSSProperties = {
  ...{
    width: "100%", fontSize: "14px",
    background: "#faf8ff",
    border: "1px solid rgba(109,40,217,0.15)",
    borderRadius: "8px", padding: "11px 14px",
    color: "#1e1b4b", outline: "none",
    resize: "vertical", fontFamily: "inherit",
    lineHeight: 1.6,
  }
}

const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 700,
  color: "#6d60c0", display: "block",
  marginBottom: "6px", textTransform: "uppercase",
  letterSpacing: "0.5px",
}

const fieldStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: "6px",
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(109,40,217,0.12)",
  borderRadius: "16px", padding: "28px",
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#7c3aed", marginLeft: "3px" }}>*</span>}</label>
      {children}
    </div>
  )
}

export default function JoinPage() {
  const [tab, setTab] = useState<Tab>("reviewer")
  const [submitted, setSubmitted] = useState(false)

  // Reviewer fields
  const [rUsername, setRUsername] = useState("")
  const [rDiscord, setRDiscord] = useState("")
  const [rPlatforms, setRPlatforms] = useState("")
  const [rGenres, setRGenres] = useState("")
  const [rMonthly, setRMonthly] = useState("")
  const [rExperience, setRExperience] = useState("")
  const [rSampleTitle, setRSampleTitle] = useState("")
  const [rHours, setRHours] = useState("")
  const [rScore, setRScore] = useState("")
  const [rPros, setRPros] = useState(["", "", ""])
  const [rCons, setRCons] = useState(["", "", ""])
  const [rBody, setRBody] = useState("")
  const [rError, setRError] = useState<string | null>(null)
  const [rLoading, setRLoading] = useState(false)

  // Developer fields
  const [dDeveloper, setDDeveloper] = useState("")
  const [dDiscord, setDDiscord] = useState("")
  const [dTitle, setDTitle] = useState("")
  const [dStatus, setDStatus] = useState("")
  const [dPlatforms, setDPlatforms] = useState("")
  const [dStore, setDStore] = useState("")
  const [dGenres, setDGenres] = useState("")
  const [dPlaytime, setDPlaytime] = useState("")
  const [dDescription, setDDescription] = useState("")
  const [dTrailer, setDTrailer] = useState("")
  const [dScreenshots, setDScreenshots] = useState("")
  const [dKeys, setDKeys] = useState("")
  const [dEmbargo, setDEmbargo] = useState("")
  const [dPressKit, setDPressKit] = useState("")
  const [dError, setDError] = useState<string | null>(null)
  const [dLoading, setDLoading] = useState(false)

  async function handleReviewerSubmit() {
    if (!rUsername.trim() || !rDiscord.trim() || !rPlatforms.trim() || !rGenres.trim() || !rMonthly.trim() || !rSampleTitle.trim() || !rBody.trim()) {
      setRError("Please fill in all required fields."); return
    }
    setRLoading(true); setRError(null)

    const body = {
      type: "reviewer",
      username: rUsername, discord: rDiscord, platforms: rPlatforms,
      genres: rGenres, monthly: rMonthly, experience: rExperience,
      sample_title: rSampleTitle, hours: rHours, score: rScore,
      pros: rPros.filter(Boolean), cons: rCons.filter(Boolean), body: rBody,
    }

    try {
      await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    } catch {}

    setRLoading(false)
    setSubmitted(true)
  }

  async function handleDeveloperSubmit() {
    if (!dDeveloper.trim() || !dDiscord.trim() || !dTitle.trim() || !dStatus.trim() || !dPlatforms.trim() || !dDescription.trim()) {
      setDError("Please fill in all required fields."); return
    }
    setDLoading(true); setDError(null)

    const body = {
      type: "developer",
      developer: dDeveloper, discord: dDiscord, title: dTitle,
      status: dStatus, platforms: dPlatforms, store: dStore,
      genres: dGenres, playtime: dPlaytime, description: dDescription,
      trailer: dTrailer, screenshots: dScreenshots, keys: dKeys,
      embargo: dEmbargo, press_kit: dPressKit,
    }

    try {
      await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    } catch {}

    setDLoading(false)
    setSubmitted(true)
  }

  const tabBtn = (t: Tab, label: string) => (
    <button onClick={() => { setTab(t); setSubmitted(false) }} style={{
      flex: 1, padding: "12px", fontSize: "14px", fontWeight: 700,
      borderRadius: "10px", cursor: "pointer", border: "none",
      background: tab === t ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "transparent",
      color: tab === t ? "#fff" : "#6d60c0",
    }}>{label}</button>
  )

  if (submitted) return (
    <div style={{ maxWidth: "600px", margin: "80px auto 0", textAlign: "center", padding: "0 16px" }}>
      <div style={{ ...card, padding: "48px" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</p>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e1b4b", marginBottom: "10px" }}>Application submitted!</h1>
        <p style={{ fontSize: "15px", color: "#6d60c0", lineHeight: 1.7, marginBottom: "24px" }}>
          Thanks for your interest in IndieScout. We review all applications and will get back to you via Discord within a few days.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={() => setSubmitted(false)} style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>Submit another</button>
          <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", padding: "10px 18px", borderRadius: "8px", textDecoration: "none" }}>Back to home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", paddingTop: "40px", paddingBottom: "64px", padding: "40px 16px 64px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(109,40,217,0.1)", boxShadow: "0 2px 12px rgba(109,40,217,0.06)", marginBottom: "0" }}>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>← Back to IndieScout</Link>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginTop: "12px", marginBottom: "6px" }}>Join IndieScout</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>Apply to become a reviewer or submit your game for coverage.</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "6px", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", borderRadius: "14px", padding: "6px", marginBottom: "24px" }}>
        {tabBtn("reviewer", "🎮 Become a reviewer")}
        {tabBtn("developer", "🚀 Submit your game")}
      </div>

      {tab === "reviewer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Your details</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="IndieScout username" required>
                <input style={inputStyle} value={rUsername} onChange={(e) => setRUsername(e.target.value)} placeholder="Your username on the site" />
              </Field>
              <Field label="Discord username" required>
                <input style={inputStyle} value={rDiscord} onChange={(e) => setRDiscord(e.target.value)} placeholder="e.g. username#0000" />
              </Field>
              <Field label="Primary platforms" required>
                <input style={inputStyle} value={rPlatforms} onChange={(e) => setRPlatforms(e.target.value)} placeholder="PC, PS5, Switch..." />
              </Field>
              <Field label="Favourite genres" required>
                <input style={inputStyle} value={rGenres} onChange={(e) => setRGenres(e.target.value)} placeholder="Roguelike, RPG, Platformer..." />
              </Field>
              <Field label="Reviews per month" required>
                <input style={inputStyle} type="number" min={1} value={rMonthly} onChange={(e) => setRMonthly(e.target.value)} placeholder="e.g. 2" />
              </Field>
              <Field label="Prior writing experience">
                <input style={inputStyle} value={rExperience} onChange={(e) => setRExperience(e.target.value)} placeholder="Links or description (optional)" />
              </Field>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Sample review</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Field label="Game title" required>
                  <input style={inputStyle} value={rSampleTitle} onChange={(e) => setRSampleTitle(e.target.value)} placeholder="Game you're reviewing" />
                </Field>
                <Field label="Hours played">
                  <input style={inputStyle} type="number" min={0} value={rHours} onChange={(e) => setRHours(e.target.value)} placeholder="e.g. 20" />
                </Field>
                <Field label="Score (1–10)" required>
                  <input style={inputStyle} type="number" min={1} max={10} step={0.5} value={rScore} onChange={(e) => setRScore(e.target.value)} placeholder="e.g. 8.5" />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Pros">
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {rPros.map((pro, i) => (
                      <input key={i} style={{ ...inputStyle, borderColor: "rgba(52,211,153,0.3)" }} value={pro} onChange={(e) => setRPros((prev) => prev.map((p, j) => j === i ? e.target.value : p))} placeholder={`Pro ${i + 1}`} />
                    ))}
                  </div>
                </Field>
                <Field label="Cons">
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {rCons.map((con, i) => (
                      <input key={i} style={{ ...inputStyle, borderColor: "rgba(248,113,113,0.3)" }} value={con} onChange={(e) => setRCons((prev) => prev.map((c, j) => j === i ? e.target.value : c))} placeholder={`Con ${i + 1}`} />
                    ))}
                  </div>
                </Field>
              </div>
              <Field label="Review body (200–300 words recommended)" required>
                <textarea style={textareaStyle} rows={8} value={rBody} onChange={(e) => setRBody(e.target.value)} placeholder="Write your sample review here..." />
                <p style={{ fontSize: "11px", color: "#9d8fc0", marginTop: "4px" }}>{rBody.split(" ").filter(Boolean).length} words</p>
              </Field>
            </div>
          </div>

          <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "12px", padding: "14px 18px" }}>
            <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6 }}>
              By submitting this application you confirm that all reviews submitted to IndieScout will be original, honest, and based on your own experience with each game.
            </p>
          </div>

          {rError && <p style={{ fontSize: "13px", color: "#dc2626" }}>{rError}</p>}
          <button onClick={handleReviewerSubmit} disabled={rLoading} style={{ fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", cursor: rLoading ? "default" : "pointer", opacity: rLoading ? 0.7 : 1 }}>
            {rLoading ? "Submitting..." : "Submit reviewer application"}
          </button>
        </div>
      )}

      {tab === "developer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Developer details</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="Developer / studio name" required>
                <input style={inputStyle} value={dDeveloper} onChange={(e) => setDDeveloper(e.target.value)} placeholder="Your studio name" />
              </Field>
              <Field label="Discord username" required>
                <input style={inputStyle} value={dDiscord} onChange={(e) => setDDiscord(e.target.value)} placeholder="e.g. username#0000" />
              </Field>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Game details</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Game title" required>
                  <input style={inputStyle} value={dTitle} onChange={(e) => setDTitle(e.target.value)} placeholder="Your game's title" />
                </Field>
                <Field label="Release status" required>
                  <select style={inputStyle} value={dStatus} onChange={(e) => setDStatus(e.target.value)}>
                    <option value="">Select status...</option>
                    <option value="Released">Released</option>
                    <option value="Early Access">Early Access</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="In Development">In Development</option>
                  </select>
                </Field>
                <Field label="Platforms" required>
                  <input style={inputStyle} value={dPlatforms} onChange={(e) => setDPlatforms(e.target.value)} placeholder="PC, PS5, Switch..." />
                </Field>
                <Field label="Genres" required>
                  <input style={inputStyle} value={dGenres} onChange={(e) => setDGenres(e.target.value)} placeholder="Roguelike, Platformer..." />
                </Field>
                <Field label="Estimated playtime">
                  <input style={inputStyle} value={dPlaytime} onChange={(e) => setDPlaytime(e.target.value)} placeholder="e.g. 10–15 hours" />
                </Field>
                <Field label="Store page link">
                  <input style={inputStyle} type="url" value={dStore} onChange={(e) => setDStore(e.target.value)} placeholder="https://store.steampowered.com/..." />
                </Field>
              </div>
              <Field label="Short description (2–5 sentences)" required>
                <textarea style={textareaStyle} rows={4} value={dDescription} onChange={(e) => setDDescription(e.target.value)} placeholder="Describe your game..." />
              </Field>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Press materials</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="Trailer link">
                <input style={inputStyle} type="url" value={dTrailer} onChange={(e) => setDTrailer(e.target.value)} placeholder="https://youtube.com/..." />
              </Field>
              <Field label="Screenshots link">
                <input style={inputStyle} type="url" value={dScreenshots} onChange={(e) => setDScreenshots(e.target.value)} placeholder="Google Drive, Dropbox..." />
              </Field>
              <Field label="Review keys available">
                <input style={inputStyle} value={dKeys} onChange={(e) => setDKeys(e.target.value)} placeholder="e.g. 5 Steam keys" />
              </Field>
              <Field label="Embargo date (optional)">
                <input style={inputStyle} type="date" value={dEmbargo} onChange={(e) => setDEmbargo(e.target.value)} />
              </Field>
              <Field label="Press kit link (optional)">
                <input style={{ ...inputStyle, gridColumn: "span 2" } as React.CSSProperties} type="url" value={dPressKit} onChange={(e) => setDPressKit(e.target.value)} placeholder="https://..." />
              </Field>
            </div>
          </div>

          <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "12px", padding: "14px 18px" }}>
            <p style={{ fontSize: "13px", color: "#6d60c0", lineHeight: 1.6 }}>
              Submitting your game does not guarantee coverage. Our team reviews all submissions and will reach out via Discord if we decide to cover your game. We aim to respond within 7 days.
            </p>
          </div>

          {dError && <p style={{ fontSize: "13px", color: "#dc2626" }}>{dError}</p>}
          <button onClick={handleDeveloperSubmit} disabled={dLoading} style={{ fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", cursor: dLoading ? "default" : "pointer", opacity: dLoading ? 0.7 : 1 }}>
            {dLoading ? "Submitting..." : "Submit game for coverage"}
          </button>
        </div>
      )}
    </div>
  )
}