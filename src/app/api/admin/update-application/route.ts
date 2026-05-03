import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { id, status, username } = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { error: appError } = await (supabase as any).from("reviewer_applications").update({ status }).eq("id", id)
    if (appError) return NextResponse.json({ error: appError.message }, { status: 500 })

    if (status === "approved" && username) {
      const { data: targetProfile } = await supabase.from("profiles").select("id").eq("username", username).single()
      if (targetProfile) {
        await supabase.from("profiles").update({ is_reviewer: true } as any).eq("id", targetProfile.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}