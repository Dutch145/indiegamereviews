import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    if (body.type === "reviewer") {
      await (supabase as any).from("reviewer_applications").insert({
        username: body.username,
        discord: body.discord,
        platforms: body.platforms,
        genres: body.genres,
        monthly_reviews: body.monthly,
        experience: body.experience || null,
        sample_title: body.sample_title,
        hours_played: body.hours ? parseInt(body.hours) : null,
        score: body.score ? parseFloat(body.score) : null,
        pros: body.pros,
        cons: body.cons,
        review_body: body.body,
      })
    } else if (body.type === "developer") {
      await (supabase as any).from("developer_submissions").insert({
        developer_name: body.developer,
        discord: body.discord,
        game_title: body.title,
        release_status: body.status,
        platforms: body.platforms,
        store_link: body.store || null,
        genres: body.genres || null,
        playtime: body.playtime || null,
        description: body.description,
        trailer_link: body.trailer || null,
        screenshots_link: body.screenshots || null,
        review_keys: body.keys || null,
        embargo_date: body.embargo || null,
        press_kit_link: body.press_kit || null,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}