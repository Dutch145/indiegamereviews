"use client";

import { useState } from "react";
import { GameCard } from "./GameCard";
import type { Game } from "@/types/database";

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null };

interface Props {
  games: GameWithReview[];
  pageSize?: number;
}

export function GameGrid({ games, pageSize = 6 }: Props) {
  const [showing, setShowing] = useState(pageSize);

  const visible = games.slice(0, showing);
  const hasMore = showing < games.length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowing((v) => v + pageSize)}
            className="px-6 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Load more ({games.length - showing} remaining)
          </button>
        </div>
      )}

      {!hasMore && games.length > pageSize && (
        <p className="text-center text-xs text-gray-300 mt-6">
          Showing all {games.length} games
        </p>
      )}
    </div>
  );
}