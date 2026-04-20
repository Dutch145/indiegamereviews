import { createClient } from "@/lib/supabase/server"
import { AdminRequestsClient } from "@/components/admin/AdminRequestsClient"

export default async function AdminRequestsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("game_requests")
    .select("*, profiles(username)")
    .order("votes", { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Game requests</h1>
      <AdminRequestsClient requests={(data ?? []) as any[]} />
    </div>
  )
}