"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CommunityReviewWithVotes } from "@/types/database";
import { scoreColor, formatDate } from "@/lib/utils";

interface Props {
  review: CommunityReviewWithVotes;
  isOwn: boolean;
  currentUserId: string | null;
}

export function CommunityReviewCard({ review, isOwn, currentUserId }: Props) {
  const [helpfulYes, setHelpfulYes] = useState(review.helpful_yes);
  const [helpfulNo, setHelpfulNo] = useState(review.helpful_no);
  const [voted, setVoted] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const supabase = createClient();

  async function vote(helpful: boolean) {
    if (!currentUserId || voted) return;
    await supabase.from("helpful_votes").upsert({
      review_id: review.id,
      user_id: currentUserId,
      helpful,
    });
    if (helpful) setHelpfulYes((v: number) => v + 1);
    else setHelpfulNo((v: number) => v + 1);
    setVoted(true);
  }

  async function flagReview() {
    if (!currentUserId || flagged) return;
    await supabase.from("flagged_reviews").upsert({
      review_id: review.id,
      flagged_by: currentUserId,
      reason: null,
    });
    setFlagged(true);
  }

  const initials = review.username.slice(0, 2).toUpperCase();
  const hasPros = review.pros && review.pros.length > 0;
  const hasCons = review.cons && review.cons.length > 0;

  return (
    <div className="py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-800 flex items-center justify-center text-xs font-medium flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {review.username}{" "}
            {isOwn && <span className="text-xs text-gray-400 font-normal">(you)</span>}
          </p>
          <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
        </div>
        <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${scoreColor(review.score)}`}>
          {review.score}
        </span>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.body}</p>

      {/* Pros & Cons */}
      {(hasPros || hasCons) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {hasPros && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-xs font-medium text-green-700 mb-2">Pros</p>
              <ul className="space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasCons && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <p className="text-xs font-medium text-red-700 mb-2">Cons</p>
              <ul className="space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="text-xs text-red-800 flex items-start gap-1.5">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!isOwn && currentUserId && (
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400">Helpful?</span>
          <button
            onClick={() => vote(true)}
            disabled={voted}
            className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Yes ({helpfulYes})
          </button>
          <button
            onClick={() => vote(false)}
            disabled={voted}
            className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            No ({helpfulNo})
          </button>
          <button
            onClick={flagReview}
            disabled={flagged}
            className="ml-auto text-xs text-gray-300 hover:text-amber-500 transition-colors disabled:opacity-50"
          >
            {flagged ? "Flagged" : "Flag"}
          </button>
        </div>
      )}
    </div>
  );
}