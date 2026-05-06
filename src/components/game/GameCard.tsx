import Link from "next/link"
import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"
import { getGenreStyle, DEFAULT_GENRE_STYLE } from "@/lib/genreStyles"

interface Props {
  game: Game & { editor_reviews?: Array<{ score_overall: number }> | null }
}

export function GameCard({ game }: Props) {
  const score = game.editor_reviews?.[0]?.score_overall ?? null
  const sc = score !== null ? scoreColor(score) : null
  const genres = game.genres ?? []
  const primaryStyle = genres.length > 0 ? getGenreStyle(genres[0]) : DEFAULT_GENRE_STYLE

  return (
    <Link href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div style={{
        background: "#fff",
        border: `2.5px solid ${primaryStyle.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        height: "100%",
        boxShadow: `0 2px 12px ${primaryStyle.bg}`,
      }}>
        <div style={{ position: "relative", height: "130px" }}>
          {game.cover_url ? (
            <img src={game.cover_url} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${primaryStyle.bg}, rgba(79,70,229,0.06))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: primaryStyle.border }}>{game.title[0]}</span>
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
            {genres.slice(0, 2).map((g: string) => {
              const gs = getGenreStyle(g)
              return (
                <span key={g} style={{ fontSize: "10px", fontWeight: 600, color: gs.color, background: gs.bg, border: `1px solid ${gs.border}`, padding: "2px 6px", borderRadius: "4px" }}>
                  {g}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
