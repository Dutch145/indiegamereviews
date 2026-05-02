import type { EditorReview } from "@/types/database"
import { formatDate, scoreColor } from "@/lib/utils"

interface Props { review: EditorReview }

const scoreCategories = [
  { key: "score_gameplay" as const, label: "Gameplay" },
  { key: "score_visuals" as const, label: "Visuals" },
  { key: "score_replayability" as const, label: "Replayability" },
  { key: "score_audio" as const, label: "Audio" },
]

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(109,40,217,0.12)",
  borderRadius: "16px",
  padding: "24px",
}

export function EditorReviewSection({ review }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Editor review body card */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>Editor&apos;s review</p>
        </div>
        <p style={{ fontSize: "15px", color: "#3d3580", lineHeight: 1.8 }}>{review.summary}</p>
      </div>

      {/* Verdict card */}
      <div style={{ ...card, background: "#faf8ff", borderLeft: "4px solid #7c3aed", borderRadius: "12px" }}>
        <p style={{ fontSize: "14px", color: "#3d3580", lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: "#7c3aed" }}>Verdict: </span>
          {review.verdict}
        </p>
      </div>

      {/* Score category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {scoreCategories.map(({ key, label }) => {
          const val = review[key]
          if (val === null) return null
          const sc = scoreColor(val)
          return (
            <div key={key} style={{ ...card, textAlign: "center", padding: "20px 16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#6d60c0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>{label}</p>
              <div style={{ height: "4px", background: "rgba(109,40,217,0.1)", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ height: "100%", width: `${(val / 10) * 100}%`, background: sc.color, borderRadius: "2px" }} />
              </div>
              <p style={{ fontSize: "24px", fontWeight: 800, color: sc.color }}>{val}</p>
            </div>
          )
        })}
      </div>

      {/* Author / date */}
      <p style={{ fontSize: "12px", color: "#6d60c0", paddingLeft: "4px" }}>
        By {review.author} · {formatDate(review.published_at)}
      </p>
    </div>
  )
}