import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminGamesPage() {
  const supabase = await createClient();

  const { data: gamesData } = await supabase
  .from("games")
  .select("*, editor_reviews(score_overall)")
  .order("created_at", { ascending: false });

  const games = (gamesData ?? []) as any[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Games</h1>
        <Link
          href="/admin/games/new"
          className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add game
        </Link>
      </div>

      {games && games.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Developer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Year</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Score</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Genres</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{game.title}</td>
                  <td className="px-5 py-3 text-gray-500">{game.developer}</td>
                  <td className="px-5 py-3 text-gray-500">{game.release_year ?? "—"}</td>
                  <td className="px-5 py-3">
                    {game.editor_reviews?.[0]?.score_overall != null ? (
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-medium">
                        {game.editor_reviews[0].score_overall}
                      </span>
                    ) : (
                      <span className="text-gray-300">No review</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {game.genres.slice(0, 2).join(", ")}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/games/edit?id=${game.id}`}
                      className="text-indigo-600 hover:underline text-xs mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/games/${game.slug}`}
                      className="text-gray-400 hover:underline text-xs"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No games yet.</p>
          <Link href="/admin/games/new" className="text-indigo-600 hover:underline text-sm">
            Add your first game
          </Link>
        </div>
      )}
    </div>
  );
}
