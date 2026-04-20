import { createClient } from "@/lib/supabase/server";
import { GameGrid } from "@/components/game/GameGrid";
import { SearchAndFilter } from "@/components/game/SearchAndFilter";
import Link from "next/link";
import type { Game } from "@/types/database";

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null };

export const metadata = {
  title: "IndieScout — Indie Game Reviews",
  description: "Discover the best indie games. Expert reviews, community opinions, editor picks and more.",
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: gamesData } = await supabase
    .from("games")
    .select("*, editor_reviews(score_overall)")
    .order("created_at", { ascending: false });

  const games = (gamesData ?? []) as GameWithReview[];

  const featured = games.find((g) => g.is_featured) ?? null;
  const spotlight = games.find((g) => g.is_spotlight) ?? null;
  const editorPicks = games.filter((g) => g.editor_pick_label);
  const trending = [...games]
    .sort((a, b) => (b.editor_reviews?.[0]?.score_overall ?? 0) - (a.editor_reviews?.[0]?.score_overall ?? 0))
    .slice(0, 4);
  const allGenres = Array.from(new Set(games.flatMap((g) => g.genres))).sort();

  return (
    <div className="space-y-12">

      {/* Featured game */}
      {featured && (
        <section>
          <Link href={`/games/${featured.slug}`}>
            <div className="rounded-2xl overflow-hidden bg-indigo-950 p-8 flex items-center gap-8 hover:opacity-95 transition-opacity cursor-pointer">
              <div className="flex-1">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-700 text-indigo-200">Featured</span>
                  {featured.genres.slice(0, 2).map((g) => (
                    <span key={g} className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-900 text-indigo-300">{g}</span>
                  ))}
                </div>
                <h1 className="text-2xl font-semibold text-indigo-50 mb-1">{featured.title}</h1>
                <p className="text-sm text-indigo-400 mb-3">{featured.developer} · {featured.release_year}</p>
                <p className="text-sm text-indigo-300 leading-relaxed mb-5 max-w-md">{featured.description}</p>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 text-indigo-100 text-sm font-medium px-4 py-2 rounded-lg">
                    Read review
                  </div>
                  {featured.editor_reviews?.[0] && (
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-green-400 text-green-900 flex items-center justify-center text-sm font-semibold">
                        {featured.editor_reviews[0].score_overall}
                      </div>
                      <span className="text-xs text-indigo-400">Editor score</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-32 h-32 rounded-xl bg-indigo-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {featured.cover_url
                  ? <img src={featured.cover_url} alt={featured.title} className="w-full h-full object-cover" />
                  : <span className="text-5xl font-bold text-indigo-800">{featured.title[0]}</span>
                }
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Search */}
      <section>
        <SearchAndFilter games={games} allGenres={allGenres} />
      </section>

      {/* Latest reviews */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>All games</SectionLabel>
          <Link href="/games" className="text-xs text-indigo-600 hover:underline">
            Browse all →
          </Link>
        </div>
        <GameGrid games={games} pageSize={6} />
      </section>

      {/* Indie spotlight */}
      {spotlight && (
        <section>
          <SectionLabel>Indie spotlight</SectionLabel>
          <Link href={`/games/${spotlight.slug}`}>
            <div className="flex overflow-hidden rounded-xl border border-amber-200 bg-white hover:shadow-sm transition-shadow">
              <div className="w-1.5 bg-amber-400 flex-shrink-0" />
              <div className="flex-1 p-5">
                <p className="text-xs font-medium text-amber-700 mb-2">This month's spotlight</p>
                <p className="text-base font-semibold text-gray-900 mb-2">{spotlight.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {spotlight.spotlight_quote ?? spotlight.description}
                </p>
              </div>
              <div className="w-24 bg-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {spotlight.cover_url
                  ? <img src={spotlight.cover_url} alt={spotlight.title} className="w-full h-full object-cover" />
                  : <span className="text-4xl font-bold text-white/20">{spotlight.title[0]}</span>
                }
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <SectionLabel>Trending games</SectionLabel>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {trending.map((game, i) => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <div className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${i < trending.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <span className="text-sm font-medium text-gray-300 w-5 text-right flex-shrink-0">{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg bg-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {game.cover_url
                      ? <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold text-white/30">{game.title[0]}</span>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{game.title}</p>
                    <p className="text-xs text-gray-400">{game.genres.slice(0, 2).join(" · ")}</p>
                  </div>
                  {game.editor_reviews?.[0] && (
                    <div className="w-9 h-9 rounded-lg bg-green-100 text-green-800 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {game.editor_reviews[0].score_overall}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Editor picks */}
      {editorPicks.length > 0 && (
        <section>
          <SectionLabel>Editor picks</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {editorPicks.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-2">
                    {game.editor_pick_label}
                  </p>
                  <p className="text-base font-semibold text-gray-900">{game.title}</p>
                  <p className="text-sm text-gray-400 mt-1">Read the full review →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{children}</p>
  );
}