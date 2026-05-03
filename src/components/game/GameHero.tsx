import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

interface Props {
  game: Game
  editorScore: number | null
}

export function GameHero({ game, editorScore }: Props) {
  const sc = editorScore !== null ? scoreColor(editorScore) : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {game.banner_url && (
        <div style={{ width: "100%", borderRadius: "16px", overflow: "hidden", maxHeight: "280px" }}>
          <img src={game.banner_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <div style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(109,40,217,0.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            {(game.genres ?? []).map((g: string) => (
              <span key={g} style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "3px 10px", borderRadius: "20px" }}>{g}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e1b4b", marginBottom: "4px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>{game.title}</h1>
          <p style={{ fontSize: "14px", color: "#6d60c0", fontWeight: 500 }}>
            {game.developer}{game.release_year ? ` · ${game.release_year}` : ""}
          </p>
          {game.description && (
            <p style={{ fontSize: "14px", color: "#3d3580", lineHeight: 1.7, marginTop: "10px" }}>{game.description}</p>
          )}
        </div>
        {sc && editorScore !== null && (
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ width: "58px", height: "58px", borderRadius: "12px", background: sc.bg, border: `1px solid ${sc.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, color: sc.color }}>
              {editorScore}
            </div>
            <p style={{ fontSize: "10px", color: "#9d8fc0", marginTop: "5px", fontWeight: 600 }}>Editor score</p>
          </div>
        )}
      </div>
    </div>
  )
}