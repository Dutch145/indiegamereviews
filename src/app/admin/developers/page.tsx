import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import type { DeveloperSpotlight } from "@/types/database"
import { formatDate } from "@/lib/utils"

const STATUS_CLASS: Record<string, string> = {
  "Released":       "bg-green-100 text-green-800",
  "Early Access":   "bg-yellow-100 text-yellow-800",
  "Coming Soon":    "bg-blue-100 text-blue-800",
  "In Development": "bg-purple-100 text-purple-800",
}

export default async function AdminDevelopersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("developer_spotlight")
    .select("*")
    .order("created_at", { ascending: false })

  const entries = (data ?? []) as DeveloperSpotlight[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Developer Spotlight</h1>
        <Link
          href="/admin/developers/new"
          className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add developer
        </Link>
      </div>

      {entries.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Game</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Developer</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hide-mobile">Featured</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hide-mobile">Added</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">{entry.game_title}</td>
                    <td className="px-5 py-3 text-gray-500">{entry.developer_name}</td>
                    <td className="px-5 py-3">
                      {entry.status ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASS[entry.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {entry.status}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 hide-mobile">{entry.is_featured ? "Yes" : "—"}</td>
                    <td className="px-5 py-3 text-gray-500 hide-mobile">{formatDate(entry.created_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/developers/edit?id=${entry.id}`}
                        className="text-indigo-600 hover:underline text-xs"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No developer spotlights yet.</p>
          <Link href="/admin/developers/new" className="text-indigo-600 hover:underline text-sm">
            Add your first developer
          </Link>
        </div>
      )}
    </div>
  )
}
