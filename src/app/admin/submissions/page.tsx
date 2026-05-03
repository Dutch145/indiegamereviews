import { createClient } from "@/lib/supabase/server"
import { AdminSubmissionsClient } from "@/components/admin/AdminSubmissionsClient"

export default async function AdminSubmissionsPage() {
  const supabase = await createClient()
  const { data } = await (supabase as any).from("developer_submissions").select("*").order("created_at", { ascending: false })
  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", marginBottom: "20px", letterSpacing: "-0.5px" }}>Developer submissions</h1>
      <AdminSubmissionsClient submissions={data ?? []} />
    </div>
  )
}