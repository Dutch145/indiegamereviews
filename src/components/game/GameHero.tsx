import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

interface Props {
  game: Game
  editorScore: number | null
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(109,40,217,0.12)",
  borderRadius: "16px",
  padding: "24px",
}

export function GameHero({ game, editorScore }: Props) {
  const sc = editorScore !== null ? scoreColor(editorScore) : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {game.banner_url && (
        <div style={{ width: "100%", height: "260px", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
          <img src={game.banner_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Game info card */}
      <div style={{ ...card, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {(game.genres ?? []).map((g: string) => (
              <span key={g} style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "4px 10px", borderRadius: "20px" }}>{g}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px", letterSpacing: "-0.5px" }}>{game.title}</h1>
          <p style={{ fontSize: "14px", color: "#6d60c0", fontWeight: 500 }}>
            {game.developer}{game.release_year ? ` · ${game.release_year}` : ""}
          </p>
          {game.description && (
            <p style={{ fontSize: "14px", color: "#3d3580", lineHeight: 1.7, marginTop: "12px", maxWidth: "600px" }}>{game.description}</p>
          )}
        </div>
        {sc && editorScore !== null && (
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "14px", background: sc.bg, border: `1px solid ${sc.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: sc.color }}>
              {editorScore}
            </div>
            <p style={{ fontSize: "11px", color: "#6d60c0", marginTop: "6px", fontWeight: 600 }}>Editor score</p>
          </div>
        )}
      </div>
    </div>
  )
}