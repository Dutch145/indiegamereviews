import { createClient } from "@/lib/supabase/server";
import { SearchAndFilter } from "@/components/game/SearchAndFilter";
import type { Game } from "@/types/database";

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null };

export const metadata = {
  title: "Browse Games",
  description: "Browse and search all indie games reviewed on IndieScout. Filter by genre, sort by score, and find your next favourite game.",
};

export default async function BrowseGamesPage() {
  const supabase = await createClient();

  const { data: gamesData } = await supabase
    .from("games")
    .select("*, editor_reviews(score_overall)")
    .order("created_at", { ascending: false });

  const games = (gamesData ?? []) as GameWithReview[];
  const allGenres = Array.from(new Set(games.flatMap((g) => g.genres))).sort();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Browse games</h1>
        <p className="text-gray-500">{games.length} indie games reviewed and counting.</p>
      </div>
      <SearchAndFilter games={games} allGenres={allGenres} alwaysOpen />
    </div>
  );
}