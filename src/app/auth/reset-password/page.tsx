"use client"

import { useState } from "react"
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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    window.location.href = "/"
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={box}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px", marginBottom: "4px" }}>Welcome back</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>Sign in to your IndieScout account</p>
      </div>
      <div style={box}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <div>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={inputStyle} />
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <Link href="/auth/forgot-password" style={{ fontSize: "12px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }}>Forgot password?</Link>
            </div>
          </div>
          {error && <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>}
          <button onClick={handleLogin} disabled={loading} style={{ fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", padding: "13px", borderRadius: "10px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
      <div style={{ ...box, textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#6d60c0" }}>
          No account?{" "}
          <Link href="/auth/signup" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}