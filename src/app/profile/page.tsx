"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Review {
  id: string;
  score: number;
  body: string;
  created_at: string;
  games: { title: string; slug: string; cover_url: string | null } | null;
}

const POINTS = { review: 10, request: 5, helpfulVote: 2, spotlight: 25 } as const

function getRank(pts: number) {
  if (pts >= 1000) return { label: "Legend", color: "#7c3aed" }
  if (pts >= 500)  return { label: "Veteran", color: "#059669" }
  if (pts >= 150)  return { label: "Contributor", color: "#2563eb" }
  if (pts >= 50)   return { label: "Explorer", color: "#d97706" }
  return { label: "Scout", color: "#6d60c0" }
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [helpfulVotes, setHelpfulVotes] = useState(0);
  const [spotlightCount, setSpotlightCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
        setNewUsername(profile.username);
      }

      const [
        { data: reviewData },
        { count: reqCount },
        { count: spotCount },
      ] = await Promise.all([
        supabase.from("community_reviews").select("id, score, body, created_at, games(title, slug, cover_url)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("game_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        (supabase as any).from("developer_spotlight").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ])

      const reviews = (reviewData as unknown as Review[]) ?? []
      setReviews(reviews)
      setRequestCount(reqCount ?? 0)
      setSpotlightCount(spotCount ?? 0)

      if (reviews.length > 0) {
        const reviewIds = reviews.map((r) => r.id)
        const { data: voteData } = await supabase.from("helpful_votes").select("id").in("review_id", reviewIds).eq("helpful", true)
        setHelpfulVotes(voteData?.length ?? 0)
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveUsername() {
    if (!user || !newUsername.trim()) return;
    setSavingUsername(true);
    setUsernameError(null);
    setUsernameSuccess(false);

    const { error } = await supabase
      .from("profiles")
      .update({ username: newUsername.trim() })
      .eq("id", user.id);

    setSavingUsername(false);
    if (error) {
      setUsernameError(error.message.includes("unique") ? "That username is already taken." : error.message);
      return;
    }
    setUsername(newUsername.trim());
    setEditingUsername(false);
    setUsernameSuccess(true);
    setTimeout(() => setUsernameSuccess(false), 3000);
  }

  async function handleDeleteReview(reviewId: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    await supabase.from("community_reviews").delete().eq("id", reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const totalPoints = reviews.length * POINTS.review + requestCount * POINTS.request + helpfulVotes * POINTS.helpfulVote + spotlightCount * POINTS.spotlight
  const rank = getRank(totalPoints)

  const avgScore = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1)
    : null;

  function scoreColor(score: number) {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-teal-100 text-teal-800";
    if (score >= 4) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto mt-16 text-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Top row: user info + points side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* Left column: user info + earn points */}
      <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-semibold flex-shrink-0">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              {editingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="text-lg font-semibold border-b-2 border-indigo-500 focus:outline-none bg-transparent w-40"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveUsername(); if (e.key === "Escape") setEditingUsername(false); }}
                  />
                  <button onClick={handleSaveUsername} disabled={savingUsername}
                    className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {savingUsername ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => { setEditingUsername(false); setNewUsername(username); }}
                    className="text-xs px-3 py-1 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{username}</h1>
                  <button onClick={() => setEditingUsername(true)}
                    className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">
                    Edit
                  </button>
                </div>
              )}
              {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
              {usernameSuccess && <p className="text-xs text-green-600 mt-1">Username updated!</p>}
              <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            Sign out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold">{reviews.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Reviews written</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold">{avgScore ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">Average score given</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold">
              {reviews.length > 0 ? Math.max(...reviews.map((r) => r.score)) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Highest score given</p>
          </div>
        </div>
      </div>

      {/* Earn more points quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Earn more points</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Write a community review", pts: "+10 pts", href: "/games", color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Suggest a game", pts: "+5 pts", href: "/suggest", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Submit to Developer Spotlight", pts: "+25 pts", href: "/developers", color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ label, pts, href, color, bg }) => (
            <Link key={href} href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color} ${bg}`}>{pts}</span>
            </Link>
          ))}
        </div>
      </div>

      </div>{/* end left column */}

      {/* Points card */}
      <div className="rounded-xl p-6" style={{ background: "linear-gradient(135deg, #2d1b69, #1e1b6e)" }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(167,139,250,0.7)" }}>Community Points</p>
            <p className="text-5xl font-extrabold text-white mt-1">{totalPoints.toLocaleString()}</p>
            <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: rank.color === "#7c3aed" ? "#a78bfa" : "white" }}>
              {rank.label}
            </span>
          </div>
          <div style={{ fontSize: "48px", opacity: 0.15 }}>★</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["Reviews written", reviews.length, POINTS.review],
            ["Helpful votes received", helpfulVotes, POINTS.helpfulVote],
            ["Games suggested", requestCount, POINTS.request],
            ["Spotlights submitted", spotlightCount, POINTS.spotlight],
          ] as [string, number, number][]).map(([label, count, pts]) => (
            <div key={label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-1" style={{ color: "rgba(167,139,250,0.7)" }}>{label}</p>
              <p className="text-sm font-bold text-white">{count} <span style={{ color: "rgba(167,139,250,0.6)", fontWeight: 400 }}>× {pts}pts</span></p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "#a78bfa" }}>{(count * pts).toLocaleString()} pts</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs" style={{ color: "rgba(167,139,250,0.5)" }}>
            Next rank: {totalPoints < 50 ? `Explorer at 50pts (${50 - totalPoints} to go)` : totalPoints < 150 ? `Contributor at 150pts (${150 - totalPoints} to go)` : totalPoints < 500 ? `Veteran at 500pts (${500 - totalPoints} to go)` : totalPoints < 1000 ? `Legend at 1000pts (${1000 - totalPoints} to go)` : "You have reached the highest rank!"}
          </p>
          <Link href="/leaderboard" className="text-xs font-semibold" style={{ color: "rgba(167,139,250,0.7)", textDecoration: "none" }}>View leaderboard →</Link>
        </div>
      </div>

      </div>{/* end top grid */}

      {/* Reviews */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Your reviews</p>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm mb-3">You haven't written any reviews yet.</p>
            <Link href="/games" className="text-sm text-indigo-600 hover:underline">
              Browse games to review →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow flex gap-4">
                <Link href={`/games/${review.games?.slug}`} className="w-12 h-12 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {review.games?.cover_url
                    ? <img src={review.games.cover_url} alt={review.games.title} className="w-full h-full object-cover" />
                    : <span className="text-white/30 font-bold">{review.games?.title[0]}</span>
                  }
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link href={`/games/${review.games?.slug}`}>
                      <p className="font-medium text-sm hover:text-indigo-600 transition-colors">{review.games?.title}</p>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${scoreColor(review.score)}`}>
                        {review.score}
                      </span>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-xs text-gray-300 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{review.body}</p>
                  <p className="text-xs text-gray-300 mt-1.5">{formatDate(review.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}