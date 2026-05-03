"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const box: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "28px",
  border: "1px solid rgba(109,40,217,0.1)",
  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: "16px",
  background: "#faf8ff",
  border: "1px solid rgba(109,40,217,0.15)",
  borderRadius: "10px", padding: "13px 16px",
  color: "#1e1b4b", outline: "none",
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle both hash-based tokens (email links) and code-based tokens (callback)
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""))
    const accessToken = hashParams.get("access_token")
    const refreshToken = hashParams.get("refresh_token")
    const type = hashParams.get("type")

    if (accessToken && type === "recovery") {
      // Set the session from the hash tokens directly
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? "",
      }).then(({ error }) => {
        if (!error) setSessionReady(true)
        else setError("Invalid or expired reset link. Please request a new one.")
      })
      return
    }

    // Also listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true)
      }
    })

    // Check if already have a valid session (came via callback route)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleReset() {
    if (!password.trim()) { setError("Please enter a new password."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    if (password !== confirm) { setError("Passwords do not match."); return }
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => router.push("/"), 3000)
  }

  if (!sessionReady) return (
    <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={box}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "4px" }}>Reset password</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>Verifying your reset link...</p>
      </div>
      <div style={{ ...box, textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#9d8fc0" }}>If this takes too long, your link may have expired.</p>
        <Link href="/auth/forgot-password" style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", textDecoration: "none", display: "block", marginTop: "12px" }}>Request a new reset link</Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={box}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "4px" }}>
          {done ? "Password updated!" : "Set new password"}
        </h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>
          {done ? "Redirecting you to the homepage..." : "Choose a new password for your account."}
        </p>
      </div>

      {done ? (
        <div style={{ ...box, textAlign: "center" }}>
          <p style={{ fontSize: "40px", marginBottom: "12px" }}>✓</p>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#059669" }}>Password updated successfully!</p>
        </div>
      ) : (
        <div style={box}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleReset()} style={inputStyle} />
            {error && <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>}
            <button onClick={handleReset} disabled={loading} style={{ fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "13px", borderRadius: "10px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>
      )}

      <div style={{ ...box, textAlign: "center" }}>
        <Link href="/auth/login" style={{ fontSize: "13px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>← Back to sign in</Link>
      </div>
    </div>
  )
}