import type { Game } from "@/types/database"
import { scoreColor } from "@/lib/utils"

interface Props {
  game: Game
  editorScore: number | null
}

export function GameHero({ game, editorScore }: Props) {
  return (
    <div>
      {game.banner_url && (
        <div className="w-full h-52 rounded-xl overflow-hidden mb-6">
          <img src={game.banner_url} alt={game.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(game.genres ?? []).map((g: string) => (
              <span key={g} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{g}</span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold">{game.title}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {game.developer}{game.release_year ? ` · ${game.release_year}` : ""}
          </p>
        </div>
        {editorScore !== null && (
          <div className="text-center flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold ${scoreColor(editorScore)}`}>
              {editorScore}
            </div>
            <p className="text-xs text-gray-400 mt-1">Editor score</p>
          </div>
        )}
      </div>
    </div>
  )
}