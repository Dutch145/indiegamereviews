"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types/database"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [username, setUsername] = useState("")
  const [navOpen, setNavOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace("/auth/login"); return }
      const { data } = await supabase.from("profiles").select("is_admin, username").eq("id", user.id).single()
      const profile = data as unknown as Pick<Profile, "is_admin" | "username"> | null
      if (!profile?.is_admin) { router.replace("/"); return }
      setUsername(profile.username)
      setReady(true)
    }
    check()
  }, [])

  useEffect(() => { setNavOpen(false) }, [pathname])

  if (!ready) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: "14px", color: "#6d60c0" }}>Loading...</p>
    </div>
  )

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/games", label: "Games" },
    { href: "/admin/community", label: "Community reviews" },
    { href: "/admin/requests", label: "Game requests" },
    { href: "/admin/applications", label: "Reviewer applications" },
    { href: "/admin/submissions", label: "Developer submissions" },
    { href: "/admin/developers", label: "Developer Spotlight" },
  ]

  const currentLabel = navItems.find((n) => n.href === pathname)?.label ?? "Admin"

  return (
    <div style={{ minHeight: "100vh", background: "#f3f0ff" }}>
      <header style={{ background: "rgba(10,10,26,0.97)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: "15px", fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IndieScout</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          {/* Mobile: show dropdown toggle */}
          <button
            className="admin-mobile-nav"
            onClick={() => setNavOpen(!navOpen)}
            style={{ display: "none", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", minHeight: "auto", padding: "4px 0" }}
          >
            {currentLabel} <span style={{ fontSize: "9px" }}>▼</span>
          </button>
          {/* Desktop label */}
          <span className="admin-sidebar" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Admin</span>
        </div>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{username}</span>
      </header>

      {/* Mobile nav dropdown */}
      {navOpen && (
        <div className="admin-mobile-nav" style={{ display: "flex", flexDirection: "column", background: "rgba(10,10,26,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 16px 14px", position: "sticky", top: "52px", zIndex: 49 }}>
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} style={{ textDecoration: "none", padding: "11px 0", fontSize: "15px", fontWeight: 600, color: pathname === href ? "#a78bfa" : "rgba(255,255,255,0.55)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "block" }}>{label}</Link>
          ))}
        </div>
      )}

      <div style={{ display: "flex" }}>
        {/* Desktop sidebar */}
        <aside className="admin-sidebar" style={{ width: "190px", minHeight: "calc(100vh - 52px)", background: "#fff", borderRight: "1px solid rgba(109,40,217,0.1)", padding: "16px 10px", flexShrink: 0 }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                textDecoration: "none", display: "block", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                background: pathname === href ? "rgba(124,58,237,0.1)" : "transparent",
                color: pathname === href ? "#7c3aed" : "#6d60c0",
                border: pathname === href ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
              }}>{label}</Link>
            ))}
          </nav>
        </aside>
        <main style={{ flex: 1, padding: "20px 16px", minWidth: 0 }}>{children}</main>
      </div>
    </div>
  )
}