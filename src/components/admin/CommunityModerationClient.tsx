"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { scoreColor, formatDate } from "@/lib/utils";

interface Review {
  id: string;
  username: string;
  score: number;
  body: string;
  created_at: string;
  helpful_yes: number;
  helpful_no: number;
  games?: { title: string; slug: string } | null;
}

interface Flag {
  id: string;
  review_id: string;
  reason: string | null;
  created_at: string;
  community_reviews: { id: string; body: string; score: number } | null;
  profiles: { username: string } | null;
}

interface Props {
  reviews: Review[];
  flags: Flag[];
  defaultTab: "all" | "flagged";
}

export function CommunityModerationClient({ reviews, flags, defaultTab }: Props) {
  const [tab, setTab] = useState<"all" | "flagged">(defaultTab);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [resolvedFlagIds, setResolvedFlagIds] = useState<Set<string>>(new Set());
  const supabase = createClient();
  const router = useRouter();

  async function deleteReview(id: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    await supabase.from("community_reviews").delete().eq("id", id);
    setDeletedIds((s) => new Set([...s, id]));
  }

  async function resolveFlag(flagId: string) {
    await supabase
      .from("flagged_reviews")
      .update({ resolved: true })
      .eq("id", flagId);
    setResolvedFlagIds((s) => new Set([...s, flagId]));
  }

  async function deleteFlaggedReview(reviewId: string, flagId: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    await supabase.from("community_reviews").delete().eq("id", reviewId);
    setDeletedIds((s) => new Set([...s, reviewId]));
    setResolvedFlagIds((s) => new Set([...s, flagId]));
  }

  const visibleReviews = reviews.filter((r) => !deletedIds.has(r.id));
  const visibleFlags = flags.filter(
    (f) => !resolvedFlagIds.has(f.id) && !deletedIds.has(f.review_id)
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(["all", "flagged"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "all" ? `All reviews (${visibleReviews.length})` : `Flagged (${visibleFlags.length})`}
          </button>
        ))}
      </div>

      {/* All reviews tab */}
      {tab === "all" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {visibleReviews.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No community reviews yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Game</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Score</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Review</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 align-top">
                    <td className="px-5 py-3 font-medium">{review.username}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {review.games?.title ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${scoreColor(review.score)}`}>
                        {review.score}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{review.body}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                      {formatDate(review.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Flagged tab */}
      {tab === "flagged" && (
        <div>
          {visibleFlags.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-1">All clear</p>
              <p className="text-sm">No unresolved flags.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleFlags.map((flag) => (
                <div key={flag.id} className="bg-white rounded-xl border border-amber-200 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs text-amber-600 font-medium mb-1">
                        Flagged by {flag.profiles?.username ?? "unknown"}
                        {" · "}{formatDate(flag.created_at)}
                      </p>
                      {flag.reason && (
                        <p className="text-sm text-gray-500">Reason: {flag.reason}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${scoreColor(flag.community_reviews?.score ?? 0)}`}>
                      {flag.community_reviews?.score}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 mb-4">
                    {flag.community_reviews?.body}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => flag.community_reviews && deleteFlaggedReview(flag.community_reviews.id, flag.id)}
                      className="text-sm px-4 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      Delete review
                    </button>
                    <button
                      onClick={() => resolveFlag(flag.id)}
                      className="text-sm px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Dismiss flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
