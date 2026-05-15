import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const supabase = await createClient()

    // Verify requester is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    // Update submission status
    const { error } = await (supabase as any).from("developer_submissions").update({ status }).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // If approving, auto-insert into developer_spotlight
    if (status === "approved") {
      const { data: sub } = await (supabase as any)
        .from("developer_submissions")
        .select("*")
        .eq("id", id)
        .single()

      if (sub) {
        // Check if already in spotlight (avoid duplicates)
        const { data: existing } = await (supabase as any)
          .from("developer_spotlight")
          .select("id")
          .eq("game_title", sub.game_title)
          .maybeSingle()

        if (!existing) {
          await (supabase as any).from("developer_spotlight").insert({
            developer_name: sub.developer_name,
            game_title: sub.game_title,
            status: sub.release_status ?? "In Development",
            cover_url: sub.screenshots_link ?? null,
            description: sub.description,
            twitter_handle: null,
            store_link: sub.store_link ?? null,
            twitter_post_url: null,
            is_featured: false,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
