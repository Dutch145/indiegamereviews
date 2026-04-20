"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg tracking-tight text-indigo-600">IndieScout</Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
            <Link href="/games" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Browse</Link>
            <Link href="/reviews" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Reviews</Link>
            <Link href="/suggest" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Suggest</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Profile</Link>
              <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = "/" }}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
              <Link href="/auth/signup" className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}