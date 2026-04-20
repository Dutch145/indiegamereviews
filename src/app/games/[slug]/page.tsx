import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EditorReviewSection } from "@/components/review/EditorReviewSection";
import { CommunityReviewList } from "@/components/review/CommunityReviewList";
import { GameHero } from "@/components/game/GameHero";
import type { Game, EditorReview, CommunityReviewWithVotes } from "@/types/database";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: gameData } = await supabase
    .from("games")
    .select("title, developer, description, cover_url, genres")
    .eq("slug", slug)
    .single();

  const game = gameData as any;
  if (!game) return { title: "Game not found" };

  const title = game.title + " Review";
  const description = game.description
    ?? ("Read the IndieScout review of " + game.title + " by " + game.developer + ". Community scores, editor verdict, and more.");

  return {
    title,
    description,
    keywords: [game.title, game.developer, "indie game review", ...game.genres],
    openGraph: {
      title,
      description,
      type: "article",
      ...(game.cover_url && { images: [{ url: game.cover_url, width: 600, height: 900 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(game.cover_url && { images: [game.cover_url] }),
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: gameData } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!gameData) notFound();

  const game = gameData as Game;

  const { data: editorReviewData } = await supabase
    .from("editor_reviews")
    .select("*")
    .eq("game_id", game.id)
    .single();

  const editorReview = editorReviewData as EditorReview | null;

  const { data: communityReviewsData } = await supabase
    .from("community_reviews_with_votes")
    .select("*")
    .eq("game_id", game.id)
    .order("helpful_yes", { ascending: false });

  const communityReviews = (communityReviewsData ?? []) as CommunityReviewWithVotes[];

  const { data: { user } } = await supabase.auth.getUser();
  const userReview = communityReviews.find((r) => r.user_id === user?.id) ?? null;

  return (
    <div className="space-y-10">
      <GameHero game={game} editorScore={editorReview?.score_overall ?? null} />
      {editorReview && <EditorReviewSection review={editorReview} />}
      <CommunityReviewList
        gameId={game.id}
        reviews={communityReviews}
        userReview={null}
      />
    </div>
  );
}