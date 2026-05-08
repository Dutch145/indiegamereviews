import { createClient } from "@/lib/supabase/server"
import { AdminUsersClient } from "@/components/admin/AdminUsersClient"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, username, is_reviewer, is_admin, created_at")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Toggle reviewer and admin roles directly.</p>
        </div>
        <span className="text-sm text-gray-400">{data?.length ?? 0} accounts</span>
      </div>
      {data && data.length > 0
        ? <AdminUsersClient users={data as any} />
        : <p className="text-gray-400 text-sm py-12 text-center">No users yet.</p>
      }
    </div>
  )
}
