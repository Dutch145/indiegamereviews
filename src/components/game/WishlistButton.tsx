"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Props {
  gameId: string
  initialSaved: boolean
  userId: string | null
}

export function WishlistButton({ gameId, initialSaved, userId }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function toggle() {
    if (!userId) { router.push("/auth/login"); return }
    setLoading(true)
    if (saved) {
      await supabase.from("game_wishlists").delete().eq("game_id", gameId).eq("user_id", userId)
    } else {
      await supabase.from("game_wishlists").insert({ game_id: gameId, user_id: userId })
    }
    setSaved(!saved)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from saved games" : "Save this game"}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "13px", fontWeight: 700, cursor: loading ? "default" : "pointer",
        padding: "9px 16px", borderRadius: "8px", border: "none",
        background: saved ? "rgba(220,38,38,0.08)" : "rgba(109,40,217,0.06)",
        color: saved ? "#dc2626" : "#6d60c0",
        opacity: loading ? 0.6 : 1, transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: "16px", lineHeight: 1 }}>{saved ? "♥" : "♡"}</span>
      {saved ? "Saved" : "Save game"}
    </button>
  )
}
