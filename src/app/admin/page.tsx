import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: gameCount },
    { count: reviewCount },
    { count: communityCount },
    { count: flagCount },
  ] = await Promise.all([
    supabase.from("games").select("*", { count: "exact", head: true }),
    supabase.from("editor_reviews").select("*", { count: "exact", head: true }),
    supabase.from("community_reviews").select("*", { count: "exact", head: true }),
    supabase
      .from("flagged_reviews")
      .select("*", { count: "exact", head: true })
      .eq("resolved", false),
  ]);

  const stats = [
    { label: "Games",             value: gameCount ?? 0,      href: "/admin/games" },
    { label: "Editor reviews",    value: reviewCount ?? 0,    href: "/admin/reviews" },
    { label: "Community reviews", value: communityCount ?? 0, href: "/admin/community" },
    { label: "Unresolved flags",  value: flagCount ?? 0,      href: "/admin/community?tab=flagged", highlight: (flagCount ?? 0) > 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, href, highlight }) => (
          <Link key={label} href={href}>
            <div className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow cursor-pointer ${highlight ? "border-amber-300" : "border-gray-200"}`}>
              <p className="text-3xl font-semibold mb-1">{value}</p>
              <p className={`text-sm ${highlight ? "text-amber-600" : "text-gray-400"}`}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/games/new">
          <div className="bg-indigo-600 text-white rounded-xl p-5 hover:bg-indigo-700 transition-colors">
            <p className="font-medium mb-1">Add game</p>
            <p className="text-sm text-indigo-200">Create a new game entry</p>
          </div>
        </Link>
        <Link href="/admin/reviews/new">
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <p className="font-medium mb-1">Write editor review</p>
            <p className="text-sm text-gray-400">Add an official review to a game</p>
          </div>
        </Link>
        <Link href="/admin/community">
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <p className="font-medium mb-1">Moderate community</p>
            <p className="text-sm text-gray-400">Review flags and manage posts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
