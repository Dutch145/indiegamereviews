"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import type { CommunityReviewWithVotes } from "@/types/database"
import { CommunityReviewCard } from "./CommunityReviewCard"
import { ReviewForm } from "./ReviewForm"
import { createClient } from "@/lib/supabase/client"

interface Props {
  gameId: string
  reviews: CommunityReviewWithVotes[]
  userReview: CommunityReviewWithVotes | null
}

export function CommunityReviewList({ gameId, reviews, userReview }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  const avgScore = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.score ?? 0), 0) / reviews.length).toFixed(1)
    : null
  const currentUserReview = userReview ?? reviews.find((r) => r.user_id === user?.id) ?? null

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(109,40,217,0.12)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "3px", height: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "2px" }} />
            <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6d60c0" }}>
              Community reviews <span style={{ color: "#9d8fc0", fontWeight: 400 }}>· {reviews.length}</span>
            </p>
          </div>
          {avgScore && (
            <p style={{ fontSize: "13px", color: "#6d60c0", paddingLeft: "11px" }}>
              <span style={{ fontWeight: 700, color: "#7c3aed" }}>{avgScore}</span> avg score
            </p>
          )}
        </div>
        {user && !currentUserReview && (
          <button onClick={() => setShowForm((v) => !v)} style={{ fontSize: "13px", fontWeight: 600, color: showForm ? "#6d60c0" : "#7c3aed", background: showForm ? "rgba(109,40,217,0.04)" : "rgba(124,58,237,0.08)", border: `1px solid ${showForm ? "rgba(109,40,217,0.1)" : "rgba(124,58,237,0.25)"}`, padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}
        {!user && (
          <a href="/auth/login" style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>Sign in to review</a>
        )}
      </div>

      {showForm && user && (
        <div style={{ marginBottom: "24px" }}>
          <ReviewForm gameId={gameId} userId={user.id} onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {reviews.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#9d8fc0", textAlign: "center", padding: "32px 0" }}>No community reviews yet — be the first!</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <CommunityReviewCard key={review.id} review={review} isOwn={review.user_id === user?.id} currentUserId={user?.id ?? null} />
          ))}
        </div>
      )}
    </div>
  )
}