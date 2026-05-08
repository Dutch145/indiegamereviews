"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export function ReviewerWelcomeBanner() {
  const [show, setShow] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (sessionStorage.getItem("reviewer_welcomed")) return
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from("profiles").select("is_reviewer").eq("id", data.user.id).single().then(({ data: p }) => {
        if ((p as any)?.is_reviewer) setShow(true)
      })
    })
  }, [])

  function dismiss() {
    sessionStorage.setItem("reviewer_welcomed", "1")
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
      padding: "12px 16px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap",
    }}>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>
        🎉 You&apos;re now an IndieScout reviewer! You can submit editor reviews for approval.
      </p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Link href="/submit-review" onClick={dismiss} style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", padding: "5px 12px", borderRadius: "6px", textDecoration: "none" }}>
          Write a review →
        </Link>
        <button onClick={dismiss} style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer", padding: "5px" }}>
          Dismiss
        </button>
      </div>
    </div>
  )
}
