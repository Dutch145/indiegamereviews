import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { CommunityModerationClient } from "@/components/admin/CommunityModerationClient";

export default async function AdminCommunityPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = await createClient();
  const tab = searchParams.tab === "flagged" ? "flagged" : "all";

  const { data: reviews } = await supabase
    .from("community_reviews_with_votes")
    .select("*, games(title, slug)")
    .order("created_at", { ascending: false });

  const { data: flags } = await supabase
    .from("flagged_reviews")
    .select("*, community_reviews(id, body, score, game_id, user_id), profiles(username)")
    .eq("resolved", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Community reviews</h1>
      <CommunityModerationClient
        reviews={reviews ?? []}
        flags={flags ?? []}
        defaultTab={tab}
      />
    </div>
  );
}
