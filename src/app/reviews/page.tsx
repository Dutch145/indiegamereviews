import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { scoreColor, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description: "All indie game reviews on IndieScout — editor reviews and community quick reviews.",
};

export default async function ReviewsPage() {
  const supabase = await createClient();

  const { data: editorReviews } = await supabase
    .from("editor_reviews")
    .select("*, games(title, slug, cover_url, genres)")
    .order("published_at", { ascending: false });

  const { data: communityReviews } = await supabase
    .from("community_reviews_with_votes")
    .select("*, games(title, slug, cover_url)")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-12">

      {/* Editor reviews */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-semibold">Editor reviews</h1>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
            {editorReviews?.length ?? 0}
          </span>
        </div>

        {editorReviews && editorReviews.length > 0 ? (
          <div className="space-y-3">
            {editorReviews.map((review) => {
              const game = review.games as any;
              return (
                <Link key={review.id} href={`/games/${game?.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow flex gap-4">
                    <div className="w-12 h-16 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {game?.cover_url
                        ? <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
                        : <span className="text-white/30 font-bold text-lg">{game?.title[0]}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-medium text-sm">{game?.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">By {review.author} · {formatDate(review.published_at)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">
                            Full review
                          </span>
                          <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${scoreColor(review.score_overall)}`}>
                            {review.score_overall}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{review.verdict}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-12">No editor reviews yet.</p>
        )}
      </section>

      {/* Community quick reviews */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-semibold">Community quick reviews</h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            Latest 20
          </span>
        </div>

        {communityReviews && communityReviews.length > 0 ? (
          <div className="space-y-3">
            {communityReviews.map((review) => {
              const game = (review as any).games;
              const hasPros = review.pros && review.pros.length > 0;
              const hasCons = review.cons && review.cons.length > 0;
              return (
                <Link key={review.id} href={`/games/${game?.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow flex gap-4">
                    <div className="w-12 h-16 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {game?.cover_url
                        ? <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
                        : <span className="text-white/30 font-bold text-lg">{game?.title[0]}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-medium text-sm">{game?.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">By {review.username} · {formatDate(review.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium border border-gray-200">
                            Quick review
                          </span>
                          <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${scoreColor(review.score)}`}>
                            {review.score}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{review.body}</p>
                      {(hasPros || hasCons) && (
                        <div className="flex gap-3 mt-2">
                          {hasPros && (
                            <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                              {review.pros.length} pro{review.pros.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {hasCons && (
                            <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              {review.cons.length} con{review.cons.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-12">No community reviews yet.</p>
        )}
      </section>

    </div>
  );
}