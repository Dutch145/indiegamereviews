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

  const editors = (editorReviews ?? []) as any[];
  const community = (communityReviews ?? []) as any[];

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-semibold">Editor reviews</h1>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">{editors.length}</span>
        </div>
        {editors.length > 0 ? (
          <div className="space-y-3">
            {editors.map((review: any) => (
              <Link key={review.id} href={"/games/" + review.games?.slug}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow flex gap-4">
                  <div className="w-12 h-16 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {review.games?.cover_url
                      ? <img src={review.games.cover_url} alt={review.games.title} className="w-full h-full object-cover" />
                      : <span className="text-white/30 font-bold text-lg">{review.games?.title[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-medium text-sm">{review.games?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">By {review.author} · {formatDate(review.published_at)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">Full review</span>
                        <span className={"text-sm font-semibold px-2.5 py-1 rounded-lg " + scoreColor(review.score_overall)}>{review.score_overall}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{review.verdict}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-12">No editor reviews yet.</p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-semibold">Community quick reviews</h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">Latest 20</span>
        </div>
        {community.length > 0 ? (
          <div className="space-y-3">
            {community.map((review: any) => (
              <Link key={review.id} href={"/games/" + review.games?.slug}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow flex gap-4">
                  <div className="w-12 h-16 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {review.games?.cover_url
                      ? <img src={review.games.cover_url} alt={review.games.title} className="w-full h-full object-cover" />
                      : <span className="text-white/30 font-bold text-lg">{review.games?.title[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-medium text-sm">{review.games?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">By {review.username} · {formatDate(review.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium border border-gray-200">Quick review</span>
                        <span className={"text-sm font-semibold px-2.5 py-1 rounded-lg " + scoreColor(review.score)}>{review.score}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{review.body}</p>
                    {(review.pros?.length > 0 || review.cons?.length > 0) && (
                      <div className="flex gap-3 mt-2">
                        {review.pros?.length > 0 && <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">{review.pros.length} pro{review.pros.length !== 1 ? "s" : ""}</span>}
                        {review.cons?.length > 0 && <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">{review.cons.length} con{review.cons.length !== 1 ? "s" : ""}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-12">No community reviews yet.</p>
        )}
      </section>
    </div>
  );
}