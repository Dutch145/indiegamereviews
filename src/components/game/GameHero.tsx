import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

interface Props {
  game: Game
  editorScore: number | null
}

function steamCover(storeLink: string | null | undefined): string | null {
  if (!storeLink) return null
  const m = storeLink.match(/store\.steampowered\.com\/app\/(\d+)/)
  return m ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${m[1]}/header.jpg` : null
}

export function GameHero({ game, editorScore }: Props) {
  const sc = editorScore !== null ? scoreColor(editorScore) : null
  const bannerImage = game.banner_url ?? steamCover(game.store_link)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {bannerImage && (
        <div style={{ width: "100%", borderRadius: "16px", overflow: "hidden", maxHeight: "280px" }}>
          <img src={bannerImage} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
          {game.store_link && (
            <a href={game.store_link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px", fontSize: "13px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #1b2838, #2a475e)", padding: "9px 16px", borderRadius: "8px", textDecoration: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View on Steam
            </a>
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