import { createClient } from "@/lib/supabase/server"
import type { DeveloperSpotlight } from "@/types/database"
import { EmbedBlock } from "@/components/developers/EmbedBlock"

export const metadata = {
  title: "Developer Spotlight",
  description: "Meet the indie developers building tomorrow's best games.",
}

type EmbedData =
  | { type: "twitter"; html: string }
  | { type: "youtube"; videoId: string }
  | { type: "reddit"; iframeSrc: string }
  | null

type EntryWithEmbed = DeveloperSpotlight & { embed: EmbedData }

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
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? null
}

function extractRedditIframeSrc(url: string): string | null {
  const match = url.match(/reddit\.com\/r\/([^/]+)\/comments\/([^/?#]+)/)
  if (!match) return null
  return `https://www.redditmedia.com/r/${match[1]}/comments/${match[2]}/?embed=true&ref_source=embed&theme=light`
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null
  const s = STATUS_STYLES[status] ?? { color: "#6d60c0", bg: "rgba(109,40,217,0.08)", border: "rgba(109,40,217,0.2)" }
  return (
    <span style={{ fontSize: "10px", fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: "3px 9px", borderRadius: "20px", flexShrink: 0 }}>
      {status}
    </span>
  )
}

function DeveloperCard({ entry }: { entry: EntryWithEmbed }) {
  const handle = entry.twitter_handle ? entry.twitter_handle.replace(/^@/, "") : null

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.1)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(109,40,217,0.06)", display: "flex", flexDirection: "column" }}>

      {/* Top: full-width banner image */}
      <div style={{ position: "relative", height: "160px", flexShrink: 0 }}>
        {entry.cover_url ? (
          <img src={entry.cover_url} alt={entry.game_title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
      </div>

      {/* Bottom: embed left + text right */}
      <div className="dev-card-body" style={{ display: "flex", flexDirection: "row", flex: 1 }}>

        {/* Bottom left: embed */}
        {entry.embed && (
          entry.embed.type === "twitter" ? (
            <div className="dev-card-embed" style={{ width: "50%", flexShrink: 0, maxHeight: "320px", overflowY: "auto", borderRight: "1px solid rgba(109,40,217,0.08)" }}>
              <EmbedBlock type="twitter" html={entry.embed.html} />
            </div>
          ) : entry.embed.type === "youtube" ? (
            <div className="dev-card-embed" style={{ width: "50%", flexShrink: 0, padding: "12px", borderRight: "1px solid rgba(109,40,217,0.08)" }}>
              <EmbedBlock type="youtube" videoId={entry.embed.videoId} />
            </div>
          ) : (
            <div className="dev-card-embed" style={{ width: "50%", flexShrink: 0, borderRight: "1px solid rgba(109,40,217,0.08)", overflow: "hidden" }}>
              <EmbedBlock type="reddit" iframeSrc={entry.embed.iframeSrc} />
            </div>
          )
        )}

        {/* Bottom right: text content */}
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e1b4b", marginBottom: "2px", lineHeight: 1.3 }}>{entry.game_title}</p>
            <p style={{ fontSize: "11px", color: "#9d8fc0" }}>{entry.developer_name}</p>
          </div>

          <StatusBadge status={entry.status} />

          {entry.description && (
            <p style={{ fontSize: "12px", color: "#3d3580", lineHeight: 1.6 }}>
              {entry.description}
            </p>
          )}

          {/* Links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "auto", paddingTop: "4px" }}>
            {entry.store_link && (
              <a href={entry.store_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", padding: "5px 10px", borderRadius: "6px", textDecoration: "none" }}>
                Store page →
              </a>
            )}
            {handle && (
              <a href={`https://x.com/${handle}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", fontWeight: 700, color: "#1d9bf0", background: "rgba(29,155,240,0.07)", border: "1px solid rgba(29,155,240,0.2)", padding: "5px 10px", borderRadius: "6px", textDecoration: "none" }}>
                @{handle}
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default async function DevelopersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("developer_spotlight")
    .select("*")
    .order("created_at", { ascending: false })

  const entries = (data ?? []) as DeveloperSpotlight[]

  const withEmbed: EntryWithEmbed[] = await Promise.all(
    entries.map(async (entry): Promise<EntryWithEmbed> => {
      if (!entry.twitter_post_url) return { ...entry, embed: null }

      const type = detectEmbedType(entry.twitter_post_url)

      if (type === "youtube") {
        const videoId = extractYouTubeId(entry.twitter_post_url)
        return { ...entry, embed: videoId ? { type: "youtube", videoId } : null }
      }

      if (type === "reddit") {
        const iframeSrc = extractRedditIframeSrc(entry.twitter_post_url)
        return { ...entry, embed: iframeSrc ? { type: "reddit" as const, iframeSrc } : null }
      }

      if (type === "twitter") {
        try {
          const res = await fetch(
            `https://publish.twitter.com/oembed?url=${encodeURIComponent(entry.twitter_post_url)}&omit_script=1`,
            { next: { revalidate: 3600 } }
          )
          if (!res.ok) return { ...entry, embed: null }
          const json = await res.json()
          return { ...entry, embed: { type: "twitter" as const, html: json.html as string } }
        } catch {
          return { ...entry, embed: null }
        }
      }

      return { ...entry, embed: null }
    })
  )

  const featured = withEmbed.filter((e) => e.is_featured)
  const rest = withEmbed.filter((e) => !e.is_featured)
  const all = [...featured, ...rest]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(109,40,217,0.1)", boxShadow: "0 2px 12px rgba(109,40,217,0.06)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px", letterSpacing: "-0.5px" }}>Developer Spotlight</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>
          Meet the indie developers building tomorrow&apos;s best games.{" "}
          {all.length > 0 && (
            <span style={{ fontWeight: 700, color: "#7c3aed" }}>{all.length} developer{all.length !== 1 ? "s" : ""} featured.</span>
          )}
        </p>
      </div>

      {all.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", border: "1px solid rgba(109,40,217,0.1)", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#9d8fc0" }}>No developer spotlights yet. Check back soon!</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid rgba(109,40,217,0.1)", boxShadow: "0 2px 12px rgba(109,40,217,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "14px" }}>
            {all.map((entry) => (
              <DeveloperCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
