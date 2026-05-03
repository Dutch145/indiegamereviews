"use client"

import { useState } from "react"
import { GameCard } from "./GameCard"
import type { Game } from "@/types/database"

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null }

interface Props {
  games: GameWithReview[]
  pageSize?: number
}

export function GameGrid({ games, pageSize = 6 }: Props) {
  const [showing, setShowing] = useState(pageSize)
  const visible = games.slice(0, showing)
  const hasMore = showing < games.length

  return (
    <div>
      <div className="games-grid-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
        {visible.map((game) => <GameCard key={game.id} game={game} />)}
      </div>
      {hasMore && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => setShowing((v) => v + pageSize)}
            style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", width: "100%", maxWidth: "300px" }}
          >
            Load more ({games.length - showing} remaining)
          </button>
        </div>
      )}
    </div>
  )
}