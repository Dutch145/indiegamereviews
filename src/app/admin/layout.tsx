"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types/database"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [username, setUsername] = useState("")
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

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  )

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/games", label: "Games" },
    { href: "/admin/reviews", label: "Editor reviews" },
    { href: "/admin/community", label: "Community reviews" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-indigo-600">IndieScout</Link>
          <span className="text-gray-300 text-sm">/</span>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
        <span className="text-sm text-gray-500">{username}</span>
      </header>
      <div className="flex">
        <aside className="w-52 min-h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 py-6 px-3 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${pathname === href ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}