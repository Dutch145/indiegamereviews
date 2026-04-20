"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type Request = {
  id: string
  title: string
  votes: number
  created_at: string
  user_id: string
}

export default function SuggestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadRequests()
  }, [])

  async function loadRequests() {
    const { data } = await supabase
      .from("game_requests")
      .select("*")
      .order("votes", { ascending: false })
    setRequests((data ?? []) as unknown as Request[])

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: votes } = await supabase
        .from("game_request_votes")
        .select("request_id")
        .eq("user_id", user.id)
      if (votes) {
        setVotedIds(new Set(votes.map((v: { request_id: string }) => v.request_id)))
      }
    }
  }

  async function handleSubmit() {
    if (!title.trim()) { setError("Please enter a game title."); return }
    if (!user) { router.push("/auth/login"); return }
    setLoading(true)
    setError(null)

    const { error: err } = await supabase.from("game_requests").insert({
      title: title.trim(),
      user_id: user.id,
    })

    setLoading(false)
    if (err) {
      setError(err.message.includes("unique")
        ? "This game has already been requested. Upvote it below!"
        : err.message)
      return
    }
    setTitle("")
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    loadRequests()
  }

  async function handleVote(requestId: string) {
    if (!user) { router.push("/auth/login"); return }

    if (votedIds.has(requestId)) {
      await supabase.from("game_request_votes").delete()
        .eq("request_id", requestId)
        .eq("user_id", user.id)
      const current = requests.find((r) => r.id === requestId)?.votes ?? 1
      await supabase.from("game_requests").update({ votes: current - 1 }).eq("id", requestId)
      setVotedIds((prev) => { const next = new Set(prev); next.delete(requestId); return next })
      setRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, votes: r.votes - 1 } : r)
          .sort((a, b) => b.votes - a.votes)
      )
    } else {
      await supabase.from("game_request_votes").insert({ request_id: requestId, user_id: user.id })
      const current = requests.find((r) => r.id === requestId)?.votes ?? 0
      await supabase.from("game_requests").update({ votes: current + 1 }).eq("id", requestId)
      setVotedIds((prev) => new Set([...prev, requestId]))
      setRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, votes: r.votes + 1 } : r)
          .sort((a, b) => b.votes - a.votes)
      )
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Suggest a game</h1>
        <p className="text-gray-500">Request a game you want us to review. Upvote requests from others to help us prioritise.</p>
      </div>

      {user ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Game title</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
              placeholder="e.g. Hades, Celeste, Hollow Knight..."
              className="flex-1 text-sm rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-2">Request submitted! Thanks for the suggestion.</p>}
        </div>
      ) : (
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 mb-8 text-center">
          <p className="text-sm text-indigo-700 mb-3">Sign in to suggest and vote on games</p>
          <a href="/auth/login" className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Sign in
          </a>
        </div>
      )}

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
          All requests <span className="font-normal text-gray-300 ml-1">· {requests.length} games</span>
        </p>

        {requests.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No requests yet — be the first!</p>
        ) : (
          <div className="space-y-2">
            {requests.map((request, i) => (
              <div key={request.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
                <span className="text-sm font-medium text-gray-300 w-6 text-right flex-shrink-0">{i + 1}</span>
                <p className="flex-1 font-medium text-sm">{request.title}</p>
                <button
                  onClick={() => handleVote(request.id)}
                  disabled={!user}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
                    votedIds.has(request.id)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span>▲</span>
                  <span>{request.votes}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}