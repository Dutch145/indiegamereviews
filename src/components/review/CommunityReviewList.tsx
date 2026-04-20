"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import type { CommunityReviewWithVotes } from "@/types/database";
import { CommunityReviewCard } from "./CommunityReviewCard";
import { ReviewForm } from "./ReviewForm";
import { createClient } from "@/lib/supabase/client";

interface Props {
  gameId: string;
  reviews: CommunityReviewWithVotes[];
  userReview: CommunityReviewWithVotes | null;
}

export function CommunityReviewList({ gameId, reviews, userReview }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [localReviews, setLocalReviews] = useState(reviews);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const avgScore =
    localReviews.length
      ? (localReviews.reduce((sum, r) => sum + r.score, 0) / localReviews.length).toFixed(1)
      : null;

  const currentUserReview = userReview ?? localReviews.find((r) => r.user_id === user?.id) ?? null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Community reviews
            <span className="font-normal text-gray-300 ml-2">· {localReviews.length} reviews</span>
          </p>
          {avgScore && (
            <p className="text-sm mt-0.5">
              <span className="font-medium">{avgScore}</span>
              <span className="text-gray-400 ml-1">avg community score</span>
            </p>
          )}
        </div>

        {user && !currentUserReview && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}

        {!user && (
          <a href="/auth/login" className="text-sm text-indigo-600 hover:underline">
            Sign in to review
          </a>
        )}
      </div>

      {showForm && user && (
        <div className="mb-6">
          <ReviewForm
            gameId={gameId}
            userId={user.id}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {localReviews.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          No community reviews yet — be the first!
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {localReviews.map((review) => (
            <CommunityReviewCard
              key={review.id}
              review={review}
              isOwn={review.user_id === user?.id}
              currentUserId={user?.id ?? null}
            />
          ))}
        </div>
      )}
    </section>
  );
}