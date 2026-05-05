"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Field, inputClass, textareaClass } from "@/components/admin/FormField"

const STATUS_OPTIONS = ["In Development", "Coming Soon", "Early Access", "Released"]

export default function NewDeveloperPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gameTitle, setGameTitle] = useState("")
  const [developerName, setDeveloperName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [storeLink, setStoreLink] = useState("")
  const [twitterPostUrl, setTwitterPostUrl] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!gameTitle.trim() || !developerName.trim()) {
      setError("Game title and developer name are required.")
      return
    }
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.from("developer_spotlight").insert({
      game_title: gameTitle.trim(),
      developer_name: developerName.trim(),
      description: description.trim() || null,
      status: status || null,
      cover_url: coverUrl.trim() || null,
      twitter_handle: twitterHandle.trim() || null,
      store_link: storeLink.trim() || null,
      twitter_post_url: twitterPostUrl.trim() || null,
      is_featured: isFeatured,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push("/admin/developers")
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
        <h1 className="text-2xl font-semibold">Add developer spotlight</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Game title *">
            <input className={inputClass} value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="Hollow Depths" />
          </Field>
          <Field label="Developer name *">
            <input className={inputClass} value={developerName} onChange={(e) => setDeveloperName(e.target.value)} placeholder="Solo Dev Studios" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">— Select status —</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Cover image URL">
            <input className={inputClass} value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
          </Field>
        </div>

        <Field label="Description">
          <textarea className={textareaClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of the game..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Twitter/X handle">
            <input className={inputClass} value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@devhandle" />
          </Field>
          <Field label="Store link (Steam, itch.io, etc.)">
            <input className={inputClass} value={storeLink} onChange={(e) => setStoreLink(e.target.value)} placeholder="https://..." />
          </Field>
        </div>

        <Field label="Post URL for embed (X/Twitter, YouTube, Reddit)">
          <input className={inputClass} value={twitterPostUrl} onChange={(e) => setTwitterPostUrl(e.target.value)} placeholder="https://x.com/... or https://youtube.com/watch?v=..." />
        </Field>

        <div className="border-t border-gray-100 pt-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm text-gray-700">Featured <span className="text-gray-400">(shown at top of the spotlight page)</span></span>
          </label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save developer"}
          </button>
          <button onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
