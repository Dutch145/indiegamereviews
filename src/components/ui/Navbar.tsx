"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Pick<Profile, "is_admin" | "is_reviewer"> | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from("profiles").select("is_admin, is_reviewer").eq("id", data.user.id).single().then(({ data: p }) => {
          setProfile(p as unknown as Pick<Profile, "is_admin" | "is_reviewer"> | null)
        })
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from("profiles").select("is_admin, is_reviewer").eq("id", session.user.id).single().then(({ data: p }) => {
          setProfile(p as unknown as Pick<Profile, "is_admin" | "is_reviewer"> | null)
        })
      } else {
        setProfile(null)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Browse" },
    { href: "/reviews", label: "Reviews" },
    { href: "/suggest", label: "Suggest" },
    { href: "/join", label: "Join" },
  ]

  const isReviewer = profile?.is_reviewer || profile?.is_admin

  return (
    <>
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,26,0.97)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: "17px", fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
              IndieScout
            </span>
          </Link>

          <nav className="desktop-nav" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500, color: pathname === href ? "#fff" : "rgba(255,255,255,0.45)" }}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user ? (
              <>
                {isReviewer && (
                  <Link href="/submit-review" style={{ textDecoration: "none", fontSize: "12px", fontWeight: 600, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", padding: "6px 12px", borderRadius: "7px" }}>Write review</Link>
                )}
                <Link href="/profile" style={{ textDecoration: "none", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "7px 14px", borderRadius: "8px" }}>Profile</Link>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/" }} style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer" }}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ textDecoration: "none", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Sign in</Link>
                <Link href="/auth/signup" style={{ textDecoration: "none", fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff", padding: "8px 16px", borderRadius: "8px" }}>Sign up</Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", flexDirection: "column", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: "8px", minHeight: "auto" }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: "rgba(255,255,255,0.7)", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none", transition: "all 0.2s" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "rgba(255,255,255,0.7)", opacity: menuOpen ? 0 : 1, transition: "all 0.2s" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "rgba(255,255,255,0.7)", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", transition: "all 0.2s" }} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{
          position: "fixed", top: "56px", left: 0, right: 0, zIndex: 49,
          background: "rgba(10,10,26,0.98)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 16px 20px",
        }}>
          <nav style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={{ textDecoration: "none", fontSize: "16px", fontWeight: 600, color: pathname === href ? "#a78bfa" : "rgba(255,255,255,0.65)", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }}>{label}</Link>
            ))}
            {isReviewer && (
              <Link href="/submit-review" style={{ textDecoration: "none", fontSize: "16px", fontWeight: 600, color: "#a78bfa", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }}>Write review</Link>
            )}
            {isReviewer && (
              <Link href="/my-drafts" style={{ textDecoration: "none", fontSize: "16px", fontWeight: 600, color: "rgba(167,139,250,0.7)", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }}>My drafts</Link>
            )}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {user ? (
              <>
                <Link href="/profile" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "13px 16px", borderRadius: "10px", textAlign: "center", display: "block" }}>Profile</Link>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/" }} style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/signup" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", color: "#fff", padding: "13px 16px", borderRadius: "10px", textAlign: "center", display: "block" }}>Sign up</Link>
                <Link href="/auth/login" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "8px", display: "block" }}>Sign in</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}