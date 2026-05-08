"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"

interface Comment {
  id: string
  username: string
  body: string
  created_at: string
  user_id: string
}

interface Props {
  reviewId: string
  currentUserId: string | null
  currentUsername: string | null
}

export function ReviewComments({ reviewId, currentUserId, currentUsername }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!open || fetched) return
    supabase
      .from("review_comments")
      .select("id, username, body, created_at, user_id")
      .eq("review_id", reviewId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setComments((data ?? []) as Comment[])
        setFetched(true)
      })
  }, [open])

  async function submit() {
    if (!body.trim() || !currentUserId || !currentUsername) return
    setLoading(true)
    const { data } = await supabase
      .from("review_comments")
      .insert({ review_id: reviewId, user_id: currentUserId, username: currentUsername, body: body.trim() })
      .select()
      .single()
    setLoading(false)
    if (data) {
      setComments((prev) => [...prev, data as Comment])
      setBody("")
    }
  }

  async function deleteComment(id: string) {
    await supabase.from("review_comments").delete().eq("id", id)
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  const toggleLabel = open
    ? "Hide comments"
    : fetched
    ? `${comments.length} comment${comments.length !== 1 ? "s" : ""}`
    : "Comments"

  return (
    <div style={{ marginTop: "8px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ fontSize: "11px", fontWeight: 600, color: "#9d8fc0", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        💬 {toggleLabel}
      </button>

      {open && (
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Comment list */}
          {comments.map((c) => (
            <div key={c.id} style={{ background: "rgba(109,40,217,0.03)", border: "1px solid rgba(109,40,217,0.08)", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#6d60c0" }}>
                  <Link href={`/user/${encodeURIComponent(c.username)}`} style={{ color: "#6d60c0", textDecoration: "none" }}>{c.username}</Link>
                  <span style={{ fontWeight: 400, color: "#9d8fc0", marginLeft: "6px" }}>· {formatDate(c.created_at)}</span>
                </p>
                {c.user_id === currentUserId && (
                  <button onClick={() => deleteComment(c.id)} style={{ fontSize: "10px", color: "#c4b5fd", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "#3d3580", lineHeight: 1.6 }}>{c.body}</p>
            </div>
          ))}

          {comments.length === 0 && fetched && (
            <p style={{ fontSize: "12px", color: "#9d8fc0" }}>No comments yet — be the first!</p>
          )}

          {/* Comment form */}
          {currentUserId ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
                placeholder="Write a comment…"
                style={{ flex: 1, fontSize: "13px", background: "#faf8ff", border: "1px solid rgba(109,40,217,0.2)", borderRadius: "8px", padding: "8px 12px", outline: "none", color: "#1e1b4b", fontFamily: "inherit" }}
              />
              <button
                onClick={submit}
                disabled={loading || !body.trim()}
                style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: loading ? "default" : "pointer", opacity: loading || !body.trim() ? 0.6 : 1, flexShrink: 0 }}
              >
                Post
              </button>
            </div>
          ) : (
            <Link href="/auth/login" style={{ fontSize: "12px", color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>Sign in to comment →</Link>
          )}
        </div>
      )}
    </div>
  )
}
