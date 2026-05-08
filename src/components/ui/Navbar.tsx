"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"

const DISCORD_URL = "https://discord.gg/N2Kzv9DYtv"

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Pick<Profile, "is_admin" | "is_reviewer"> | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [draftBadge, setDraftBadge] = useState(0)
  const supabase = createClient()
  const pathname = usePathname()

  async function fetchDraftBadge(userId: string) {
    const { count } = await supabase.from("review_drafts").select("id", { count: "exact", head: true }).eq("author_id", userId).neq("status", "pending")
    const seen = parseInt(localStorage.getItem("drafts_seen_count") ?? "0")
    setDraftBadge(Math.max(0, (count ?? 0) - seen))
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from("profiles").select("is_admin, is_reviewer").eq("id", data.user.id).single().then(({ data: p }) => {
          const prof = p as unknown as Pick<Profile, "is_admin" | "is_reviewer"> | null
          setProfile(prof)
          if (prof?.is_reviewer || prof?.is_admin) fetchDraftBadge(data.user!.id)
        })
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from("profiles").select("is_admin, is_reviewer").eq("id", session.user.id).single().then(({ data: p }) => {
          const prof = p as unknown as Pick<Profile, "is_admin" | "is_reviewer"> | null
          setProfile(prof)
          if (prof?.is_reviewer || prof?.is_admin) fetchDraftBadge(session.user!.id)
        })
      } else {
        setProfile(null)
        setDraftBadge(0)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (pathname === "/my-drafts" && draftBadge > 0) {
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return
        supabase.from("review_drafts").select("id", { count: "exact", head: true }).eq("author_id", data.user.id).neq("status", "pending").then(({ count }) => {
          localStorage.setItem("drafts_seen_count", String(count ?? 0))
          setDraftBadge(0)
        })
      })
    }
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Browse" },
    { href: "/reviews", label: "Reviews" },
    { href: "/developers", label: "Developers" },
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

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500, color: pathname === href ? "#fff" : "rgba(255,255,255,0.45)" }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Discord button */}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", padding: "6px 12px", borderRadius: "8px" }}>
              <DiscordIcon />
              Discord
            </a>
            {user ? (
              <>
                {isReviewer && (
                  <Link href="/submit-review" style={{ textDecoration: "none", fontSize: "12px", fontWeight: 600, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", padding: "6px 12px", borderRadius: "7px" }}>Write review</Link>
                )}
                {isReviewer && (
                  <Link href="/my-drafts" style={{ textDecoration: "none", fontSize: "12px", fontWeight: 600, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", padding: "6px 12px", borderRadius: "7px", display: "flex", alignItems: "center", gap: "6px", position: "relative" }}>
                    My drafts
                    {draftBadge > 0 && (
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#fff", background: "#7c3aed", borderRadius: "10px", padding: "1px 5px", lineHeight: 1.4 }}>{draftBadge}</span>
                    )}
                  </Link>
                )}
                {profile?.is_admin && (
                  <Link href="/admin" style={{ textDecoration: "none", fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", padding: "6px 12px", borderRadius: "7px" }}>Admin</Link>
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

          {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
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
              <Link href="/my-drafts" style={{ textDecoration: "none", fontSize: "16px", fontWeight: 600, color: "rgba(167,139,250,0.7)", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px" }}>
                My drafts
                {draftBadge > 0 && (
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#fff", background: "#7c3aed", borderRadius: "10px", padding: "2px 7px" }}>{draftBadge}</span>
                )}
              </Link>
            )}
            {/* Discord in mobile menu */}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", fontSize: "16px", fontWeight: 600, color: "#a78bfa", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px" }}>
              <DiscordIcon /> Join our Discord
            </a>
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {user ? (
              <>
                <Link href="/profile" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "13px 16px", borderRadius: "10px", textAlign: "center", display: "block" }}>Profile</Link>
                {profile?.is_admin && (
                  <Link href="/admin" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", padding: "13px 16px", borderRadius: "10px", textAlign: "center", display: "block" }}>Admin panel</Link>
                )}
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