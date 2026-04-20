"use client";

import { useState, useMemo } from "react";
import { GameCard } from "./GameCard";
import { GameGrid } from "./GameGrid";
import type { Game } from "@/types/database";

type GameWithReview = Game & { editor_reviews: Array<{ score_overall: number }> | null };

interface Props {
  games: GameWithReview[];
  allGenres: string[];
  alwaysOpen?: boolean;
}

type SortOption = "newest" | "score" | "az";

export function SearchAndFilter({ games, allGenres, alwaysOpen = false }: Props) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [isOpen, setIsOpen] = useState(alwaysOpen);

  const filtered = useMemo(() => {
    let result = [...games];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.developer.toLowerCase().includes(q)
      );
    }

    if (selectedGenre) {
      result = result.filter((g) => g.genres.includes(selectedGenre));
    }

    if (sort === "score") {
      result.sort((a, b) => (b.editor_reviews?.[0]?.score_overall ?? 0) - (a.editor_reviews?.[0]?.score_overall ?? 0));
    } else if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [games, query, selectedGenre, sort]);

  const isFiltering = query.trim() !== "" || selectedGenre !== null;

  if (!isOpen && !isFiltering) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
      >
        Search games by title or developer...
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          autoFocus={!alwaysOpen}
          placeholder="Search by title or developer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-sm rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-600"
        >
          <option value="newest">Newest</option>
          <option value="score">Highest score</option>
          <option value="az">A–Z</option>
        </select>
        {!alwaysOpen && (
          <button
            onClick={() => { setIsOpen(false); setQuery(""); setSelectedGenre(null); setSort("newest"); }}
            className="text-sm px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {allGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedGenre === genre
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div>
          <p className="text-xs text-gray-400 mb-3">
            {filtered.length} game{filtered.length !== 1 ? "s" : ""} found
          </p>
          <GameGrid games={filtered} pageSize={12} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No games found matching your search.</p>
          <button
            onClick={() => { setQuery(""); setSelectedGenre(null); }}
            className="text-indigo-600 text-sm hover:underline mt-2 block mx-auto"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}