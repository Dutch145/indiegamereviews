import Link from "next/link"
import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

interface Props {
  game: Game & { editor_reviews?: Array<{ score_overall: number }> | null }
}

export function GameCard({ game }: Props) {
  const score = game.editor_reviews?.[0]?.score_overall ?? null
  const sc = score !== null ? scoreColor(score) : null

  return (
    <Link href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div style={{
        background: "#fff",
        border: "1px solid rgba(109,40,217,0.1)",
        borderRadius: "12px", overflow: "hidden",
        height: "100%",
        boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
      }}>
        <div style={{ position: "relative", height: "130px" }}>
          {game.cover_url ? (
            <img src={game.cover_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: "rgba(124,58,237,0.3)" }}>{game.title[0]}</span>
            </div>
          )}
          {sc && (
            <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", border: `1px solid ${sc.color}33`, borderRadius: "6px", padding: "2px 7px", fontSize: "12px", fontWeight: 700, color: sc.color }}>
              {score}
            </div>
          )}
        </div>
        <div style={{ padding: "10px 12px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b", marginBottom: "2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.title}</p>
          <p style={{ fontSize: "11px", color: "#9d8fc0", marginBottom: "7px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.developer}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {(game.genres ?? []).slice(0, 2).map((g: string) => (
              <span key={g} style={{ fontSize: "10px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.15)", padding: "2px 6px", borderRadius: "4px" }}>{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}