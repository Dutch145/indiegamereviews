import { createClient } from "@/lib/supabase/server"
import type { DeveloperSpotlight } from "@/types/database"
import { TweetEmbed } from "@/components/developers/TweetEmbed"

export const metadata = {
  title: "Developer Spotlight",
  description: "Meet the indie developers building tomorrow's best games.",
}

type EntryWithOembed = DeveloperSpotlight & { oembed: string | null }

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "Released":       { color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.2)" },
  "Early Access":   { color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)" },
  "Coming Soon":    { color: "#2563eb", bg: "rgba(37,99,235,0.08)",   border: "rgba(37,99,235,0.2)" },
  "In Development": { color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null
  const s = STATUS_STYLES[status] ?? { color: "#6d60c0", bg: "rgba(109,40,217,0.08)", border: "rgba(109,40,217,0.2)" }
  return (
    <span style={{
      fontSize: "10px", fontWeight: 700, color: s.color,
      background: s.bg, border: `1px solid ${s.border}`,
      padding: "3px 9px", borderRadius: "20px", flexShrink: 0,
    }}>
      {status}
    </span>
  )
}

function DeveloperCard({ entry }: { entry: EntryWithOembed }) {
  const handle = entry.twitter_handle ? entry.twitter_handle.replace(/^@/, "") : null

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(109,40,217,0.1)",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Cover image */}
      <div style={{ position: "relative", height: "130px", flexShrink: 0 }}>
        {entry.cover_url ? (
          <img src={entry.cover_url} alt={entry.game_title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "rgba(124,58,237,0.3)" }}>{entry.game_title[0]}</span>
          </div>
        )}
        {entry.is_featured && (
          <div style={{ position: "absolute", top: "8px", left: "8px", fontSize: "10px", fontWeight: 700, color: "#7c3aed", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", border: "1px solid rgba(124,58,237,0.3)", padding: "2px 7px", borderRadius: "5px" }}>
            ★ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
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

        {/* Tweet embed */}
        {entry.oembed && (
          <div style={{ marginTop: "4px" }}>
            <TweetEmbed html={entry.oembed} />
          </div>
        )}
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

  const withOembed: EntryWithOembed[] = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.twitter_post_url) return { ...entry, oembed: null }
      try {
        const res = await fetch(
          `https://publish.twitter.com/oembed?url=${encodeURIComponent(entry.twitter_post_url)}&omit_script=1`,
          { next: { revalidate: 3600 } }
        )
        if (!res.ok) return { ...entry, oembed: null }
        const json = await res.json()
        return { ...entry, oembed: (json.html as string) ?? null }
      } catch {
        return { ...entry, oembed: null }
      }
    })
  )

  const featured = withOembed.filter((e) => e.is_featured)
  const rest = withOembed.filter((e) => !e.is_featured)
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
          <div className="games-grid-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
            {all.map((entry) => (
              <DeveloperCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
