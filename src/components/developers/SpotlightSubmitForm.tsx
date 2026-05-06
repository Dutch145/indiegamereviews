"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const STATUS_OPTIONS = ["In Development", "Coming Soon", "Early Access", "Released"]

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: "13px", borderRadius: "8px",
  border: "1px solid rgba(109,40,217,0.2)", padding: "8px 12px",
  outline: "none", background: "#fff", fontFamily: "inherit",
}

const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, color: "#6d60c0",
  display: "block", marginBottom: "4px",
}

export function SpotlightSubmitForm() {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gameTitle, setGameTitle] = useState("")
  const [developerName, setDeveloperName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [storeLink, setStoreLink] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [postUrl, setPostUrl] = useState("")
  const supabase = createClient()

  async function handleSubmit() {
    if (!gameTitle.trim() || !developerName.trim()) {
      setError("Game title and developer name are required.")
      return
    }
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from("developer_spotlight").insert({
      game_title: gameTitle.trim(),
      developer_name: developerName.trim(),
      description: description.trim() || null,
      status: status || null,
      store_link: storeLink.trim() || null,
      twitter_handle: twitterHandle.trim() || null,
      cover_url: coverUrl.trim() || null,
      twitter_post_url: postUrl.trim() || null,
      is_featured: false,
      user_id: user?.id ?? null,
    })
    setLoading(false)
    if (err) { setError("Submission failed. Please try again."); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: "14px", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "16px", fontWeight: 800, color: "#059669", marginBottom: "6px" }}>Submitted successfully!</p>
        <p style={{ fontSize: "13px", color: "#6d60c0" }}>Our team will review your game and add it to the spotlight if approved. Thanks for sharing!</p>
      </div>
    )
  }

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.12)", borderRadius: "14px", boxShadow: "0 2px 8px rgba(109,40,217,0.06)", overflow: "hidden" }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left", minHeight: "auto" }}
      >
        <div>
          <p style={{ fontSize: "15px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.3px" }}>Submit Your Game for Spotlight</p>
          <p style={{ fontSize: "12px", color: "#6d60c0", marginTop: "3px" }}>Share your indie game with the IndieScout community. Reviewed by our team before publishing.</p>
        </div>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "16px", fontSize: "16px", fontWeight: 700, color: "#7c3aed" }}>
          {open ? "−" : "+"}
        </div>
      </button>

      {/* Form body */}
      {open && (
        <div style={{ padding: "0 22px 22px", borderTop: "1px solid rgba(109,40,217,0.08)" }}>
          <div style={{ paddingTop: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Game title *</label>
              <input style={inputStyle} value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="Hollow Depths" />
            </div>
            <div>
              <label style={labelStyle}>Developer name *</label>
              <input style={inputStyle} value={developerName} onChange={(e) => setDeveloperName(e.target.value)} placeholder="Solo Dev Studio" />
            </div>
            <div>
              <label style={labelStyle}>Game status</label>
              <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">— Select —</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Store link</label>
              <input style={inputStyle} value={storeLink} onChange={(e) => setStoreLink(e.target.value)} placeholder="https://store.steampowered.com/..." />
            </div>
            <div>
              <label style={labelStyle}>Twitter/X handle</label>
              <input style={inputStyle} value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@yourhandle" />
            </div>
            <div>
              <label style={labelStyle}>Cover image URL</label>
              <input style={inputStyle} value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your game..."
            />
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={labelStyle}>Post URL for embed (X/Twitter, YouTube, or Reddit)</label>
            <input style={inputStyle} value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="https://x.com/..." />
          </div>

          {error && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "10px" }}>{error}</p>}

          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ fontSize: "13px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", padding: "10px 22px", borderRadius: "8px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Submitting..." : "Submit for review"}
            </button>
            <p style={{ fontSize: "11px", color: "#9d8fc0" }}>Our team reviews all submissions before they appear on the page.</p>
          </div>
        </div>
      )}
    </div>
  )
}
