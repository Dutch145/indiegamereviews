"use client"

import { useState, useEffect } from "react"
import type { DeveloperSpotlight } from "@/types/database"
import { EmbedBlock } from "./EmbedBlock"

type EmbedData =
  | { type: "twitter"; html: string }
  | { type: "youtube"; videoId: string }
  | { type: "reddit"; iframeSrc: string }
  | null

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "Released":       { color: "#059669", bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.2)" },
  "Early Access":   { color: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.2)" },
  "Coming Soon":    { color: "#2563eb", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.2)" },
  "In Development": { color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
}

function detectEmbedType(url: string): "twitter" | "youtube" | "reddit" | null {
  if (/twitter\.com|x\.com/i.test(url)) return "twitter"
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube"
  if (/reddit\.com/i.test(url)) return "reddit"
  return null
}

function extractYouTubeId(url: string): string | null {
  return url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null
}

function extractRedditIframeSrc(url: string): string | null {
  const m = url.match(/reddit\.com\/r\/([^/]+)\/comments\/([^/?#]+)/)
  return m ? `https://www.redditmedia.com/r/${m[1]}/comments/${m[2]}/?embed=true&ref_source=embed&theme=light` : null
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null
  const s = STATUS_STYLES[status] ?? { color: "#6d60c0", bg: "rgba(109,40,217,0.08)", border: "rgba(109,40,217,0.2)" }
  return (
    <span style={{ fontSize: "10px", fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: "2px 8px", borderRadius: "20px" }}>
      {status}
    </span>
  )
}

function SpotlightModal({ entry, onClose }: { entry: DeveloperSpotlight; onClose: () => void }) {
  const [embed, setEmbed] = useState<EmbedData>(null)
  const [embedLoading, setEmbedLoading] = useState(false)
  const handle = entry.twitter_handle ? entry.twitter_handle.replace(/^@/, "") : null

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  useEffect(() => {
    if (!entry.twitter_post_url) return
    const type = detectEmbedType(entry.twitter_post_url)

    if (type === "youtube") {
      const videoId = extractYouTubeId(entry.twitter_post_url)
      if (videoId) setEmbed({ type: "youtube", videoId })
      return
    }
    if (type === "reddit") {
      const iframeSrc = extractRedditIframeSrc(entry.twitter_post_url)
      if (iframeSrc) setEmbed({ type: "reddit", iframeSrc })
      return
    }
    if (type === "twitter") {
      setEmbedLoading(true)
      fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(entry.twitter_post_url)}&omit_script=1`)
        .then((r) => r.json())
        .then((json) => { setEmbed({ type: "twitter", html: json.html as string }); setEmbedLoading(false) })
        .catch(() => setEmbedLoading(false))
    }
  }, [entry.twitter_post_url])

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,26,0.75)", backdropFilter: "blur(8px)", padding: "16px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "760px", maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
      >
        {/* Cover image */}
        <div style={{ position: "relative", height: "220px", flexShrink: 0, overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
          {entry.cover_url ? (
            <img src={entry.cover_url} alt={entry.game_title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "64px", fontWeight: 800, color: "rgba(124,58,237,0.3)" }}>{entry.game_title[0]}</span>
            </div>
          )}
          {/* Gradient overlay for readability */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
          {entry.is_featured && (
            <div style={{ position: "absolute", top: "14px", left: "14px", fontSize: "11px", fontWeight: 700, color: "#7c3aed", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", border: "1px solid rgba(124,58,237,0.3)", padding: "3px 10px", borderRadius: "6px" }}>
              ★ Featured
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "14px", right: "14px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {/* Header */}
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "4px" }}>{entry.game_title}</h2>
            <p style={{ fontSize: "13px", color: "#9d8fc0", marginBottom: "10px" }}>{entry.developer_name}</p>
            <StatusBadge status={entry.status} />
          </div>

          {/* Two-column: description left, embed right */}
          <div style={{ display: "grid", gridTemplateColumns: embed || entry.twitter_post_url ? "1fr 1fr" : "1fr", gap: "20px", alignItems: "start" }}>

            {/* Left: description + links */}
            <div>
              {entry.description && (
                <p style={{ fontSize: "14px", color: "#3d3580", lineHeight: 1.8, marginBottom: "16px" }}>{entry.description}</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {entry.store_link && (
                  <a href={entry.store_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", padding: "8px 16px", borderRadius: "8px", textDecoration: "none" }}>
                    Store page →
                  </a>
                )}
                {handle && (
                  <a href={`https://x.com/${handle}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: 700, color: "#1d9bf0", background: "rgba(29,155,240,0.07)", border: "1px solid rgba(29,155,240,0.2)", padding: "8px 16px", borderRadius: "8px", textDecoration: "none" }}>
                    @{handle}
                  </a>
                )}
                {entry.twitter_post_url && (
                  <a href={entry.twitter_post_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: 600, color: "#6d60c0", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.15)", padding: "8px 16px", borderRadius: "8px", textDecoration: "none" }}>
                    View post →
                  </a>
                )}
              </div>
            </div>

            {/* Right: embed */}
            {entry.twitter_post_url && (
              <div>
                {embedLoading && (
                  <div style={{ height: "120px", background: "rgba(109,40,217,0.04)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: "12px", color: "#9d8fc0" }}>Loading post…</p>
                  </div>
                )}
                {embed && (
                  embed.type === "twitter" ? (
                    <div style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "12px", border: "1px solid rgba(109,40,217,0.08)" }}>
                      <EmbedBlock type="twitter" html={embed.html} />
                    </div>
                  ) : embed.type === "youtube" ? (
                    <EmbedBlock type="youtube" videoId={embed.videoId} />
                  ) : (
                    <div style={{ borderRadius: "12px", overflow: "hidden" }}>
                      <EmbedBlock type="reddit" iframeSrc={embed.iframeSrc} />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DeveloperCard({ entry, onClick }: { entry: DeveloperSpotlight; onClick: () => void }) {
  const handle = entry.twitter_handle ? entry.twitter_handle.replace(/^@/, "") : null
  return (
    <div
      onClick={onClick}
      style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.1)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(109,40,217,0.06)", display: "flex", flexDirection: "column", height: "100%", cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(109,40,217,0.14)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)" }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(109,40,217,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "none" }}
    >
      <div style={{ position: "relative", height: "130px", flexShrink: 0 }}>
        {entry.cover_url ? (
          <img src={entry.cover_url} alt={entry.game_title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "40px", fontWeight: 800, color: "rgba(124,58,237,0.3)" }}>{entry.game_title[0]}</span>
          </div>
        )}
        {entry.is_featured && (
          <div style={{ position: "absolute", top: "8px", left: "8px", fontSize: "10px", fontWeight: 700, color: "#7c3aed", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", border: "1px solid rgba(124,58,237,0.3)", padding: "2px 7px", borderRadius: "5px" }}>
            ★ Featured
          </div>
        )}
        {entry.twitter_post_url && (
          <div style={{ position: "absolute", bottom: "8px", right: "8px", fontSize: "10px", fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", padding: "2px 7px", borderRadius: "5px" }}>
            ▶ View post
          </div>
        )}
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b", marginBottom: "2px", lineHeight: 1.3 }}>{entry.game_title}</p>
          <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{entry.developer_name}</p>
        </div>
        <StatusBadge status={entry.status} />
        {entry.description && (
          <p style={{ fontSize: "12px", color: "#3d3580", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
            {entry.description}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "auto", paddingTop: "4px" }}>
          {entry.store_link && (
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", padding: "4px 10px", borderRadius: "6px" }}>
              Store page →
            </span>
          )}
          {handle && (
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1d9bf0", background: "rgba(29,155,240,0.07)", border: "1px solid rgba(29,155,240,0.2)", padding: "4px 10px", borderRadius: "6px" }}>
              @{handle}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function DeveloperSpotlightGrid({ entries }: { entries: DeveloperSpotlight[] }) {
  const [selected, setSelected] = useState<DeveloperSpotlight | null>(null)

  return (
    <>
      <div className="games-grid-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: "14px" }}>
        {entries.map((entry) => (
          <DeveloperCard key={entry.id} entry={entry} onClick={() => setSelected(entry)} />
        ))}
      </div>
      {selected && <SpotlightModal entry={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
