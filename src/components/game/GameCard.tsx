import Link from "next/link"
import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

interface Props {
  game: Game & { editor_reviews?: Array<{ score_overall: number }> | null }
}

export function GameCard({ game }: Props) {
  const score = game.editor_reviews?.[0]?.score_overall ?? null

  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          {game.cover_url ? (
            <div className="h-40 bg-gray-100">
              <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-br from-indigo-900 to-indigo-600 flex items-center justify-center">
              <span className="text-white/40 text-4xl font-bold">{game.title[0]}</span>
            </div>
          )}
          {score !== null && (
            <div className="absolute top-2 right-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-indigo-600 border border-indigo-100">Reviewed</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-medium group-hover:text-indigo-600 transition-colors">{game.title}</h2>
              <p className="text-sm text-gray-400">{game.developer}</p>
            </div>
            {score !== null && (
              <span className={`text-sm font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${scoreColor(score)}`}>{score}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {(game.genres ?? []).slice(0, 3).map((g: string) => (
              <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}