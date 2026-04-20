import { createClient } from "@/lib/supabase/server";
import { SearchAndFilter } from "@/components/game/SearchAndFilter";

export const metadata = {
  title: "Browse Games",
  description: "Browse and search all indie games reviewed on IndieScout. Filter by genre, sort by score, and find your next favourite game.",
};

export default async function BrowseGamesPage() {
  const supabase = await createClient();

  const { data: games } = await supabase
    .from("games")
    .select("*, editor_reviews(score_overall)")
    .order("created_at", { ascending: false });

  const allGames = (games ?? []);
  const allGenres = Array.from(new Set(allGames.flatMap((g: any) => g.genres))).sort() as string[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Browse games</h1>
        <p className="text-gray-500">{allGames.length} indie games reviewed and counting.</p>
      </div>
      <SearchAndFilter games={allGames} allGenres={allGenres} alwaysOpen />
    </div>
  );
}