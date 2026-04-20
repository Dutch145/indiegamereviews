"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"

interface Request {
  id: string
  title: string
  votes: number
  created_at: string
  profiles: { username: string } | null
}

interface Props {
  requests: Request[]
}

export function AdminRequestsClient({ requests: initial }: Props) {
  const [requests, setRequests] = useState(initial)
  const supabase = createClient()

  async function handleDelete(id: string) {
    if (!confirm("Delete this request?")) return
    await supabase.from("game_requests").delete().eq("id", id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  if (requests.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-16">No game requests yet.</p>
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-5 py-3 font-medium text-gray-500">Game title</th>
            <th className="text-left px-5 py-3 font-medium text-gray-500">Requested by</th>
            <th className="text-left px-5 py-3 font-medium text-gray-500">Votes</th>
            <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium">{request.title}</td>
              <td className="px-5 py-3 text-gray-500">{request.profiles?.username ?? "—"}</td>
              <td className="px-5 py-3">
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
                  ▲ {request.votes}
                </span>
              </td>
              <td className="px-5 py-3 text-gray-500">{formatDate(request.created_at)}</td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => handleDelete(request.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}