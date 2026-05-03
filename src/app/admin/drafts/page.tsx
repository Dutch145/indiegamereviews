import { createClient } from "@/lib/supabase/server"
import { AdminDraftsClient } from "@/components/admin/AdminDraftsClient"

export default async function AdminDraftsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("review_drafts")
    .select("*, games(title, slug), profiles(username)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", marginBottom: "20px", letterSpacing: "-0.5px" }}>Review drafts</h1>
      <AdminDraftsClient drafts={(data ?? []) as any[]} />
    </div>
  )
}