import { createClient } from "@/lib/supabase/server"
import { AdminApplicationsClient } from "@/components/admin/AdminApplicationsClient"

export default async function AdminApplicationsPage() {
  const supabase = await createClient()
  const { data } = await (supabase as any).from("reviewer_applications").select("*").order("created_at", { ascending: false })
  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", marginBottom: "20px", letterSpacing: "-0.5px" }}>Reviewer applications</h1>
      <AdminApplicationsClient applications={data ?? []} />
    </div>
  )
}