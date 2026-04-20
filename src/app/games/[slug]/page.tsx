import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { EditorReviewSection } from "@/components/review/EditorReviewSection"
import { CommunityReviewList } from "@/components/review/CommunityReviewList"
import { GameHero } from "@/components/game/GameHero"
import type { Game, EditorReview, CommunityReviewWithVotes } from "@/types/database"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("games")
    .select("title, developer, description, cover_url, genres")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "Game not found" }

  const game = data as unknown as Game
  const title = `${game.title} Review`
  const description = game.description
    ?? `Read the IndieScout review of ${game.title} by ${game.developer}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(game.cover_url && { images: [{ url: game.cover_url }] }),
    },
  }
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gameData } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!gameData) notFound()
  const game = gameData as unknown as Game

  const { data: editorData } = await supabase
    .from("editor_reviews")
    .select("*")
    .eq("game_id", game.id)
    .single()
  const editorReview = editorData as unknown as EditorReview | null

  const { data: communityData } = await supabase
    .from("community_reviews_with_votes")
    .select("*")
    .eq("game_id", game.id)
    .order("helpful_yes", { ascending: false })
  const communityReviews = (communityData ?? []) as unknown as CommunityReviewWithVotes[]

  return (
    <div className="space-y-10">
      <GameHero game={game} editorScore={editorReview?.score_overall ?? null} />
      {editorReview && <EditorReviewSection review={editorReview} />}
      <CommunityReviewList gameId={game.id} reviews={communityReviews} userReview={null} />
    </div>
  )
}