"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"

interface UserProfile {
  id: string
  username: string
  is_reviewer: boolean
  is_admin: boolean
  created_at: string
}

const pill = (active: boolean, activeColor: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: "5px",
  fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", cursor: "pointer",
  border: "none", transition: "all 0.15s",
  background: active ? activeColor : "rgba(109,40,217,0.06)",
  color: active ? "#fff" : "#9d8fc0",
})

export function AdminUsersClient({ users: initial }: { users: UserProfile[] }) {
  const [users, setUsers] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggle(userId: string, role: "is_reviewer" | "is_admin", current: boolean) {
    const key = `${userId}-${role}`
    if (loading === key) return
    setLoading(key)
    const res = await fetch("/api/admin/update-user-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role, value: !current }),
    })
    setLoading(null)
    if (!res.ok) { alert("Failed to update role."); return }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, [role]: !current } : u))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="table-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Username</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 hide-mobile">Joined</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Reviewer</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-semibold text-gray-800">{u.username}</td>
                <td className="px-5 py-3 text-gray-400 hide-mobile">{formatDate(u.created_at)}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(u.id, "is_reviewer", u.is_reviewer)}
                    disabled={loading === `${u.id}-is_reviewer`}
                    style={pill(u.is_reviewer, "#059669")}
                  >
                    {u.is_reviewer ? "✓ Reviewer" : "× Not reviewer"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(u.id, "is_admin", u.is_admin)}
                    disabled={loading === `${u.id}-is_admin`}
                    style={pill(u.is_admin, "#7c3aed")}
                  >
                    {u.is_admin ? "✓ Admin" : "× Not admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
