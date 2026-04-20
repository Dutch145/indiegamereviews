import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: reviewsData } = await supabase
    .from("editor_reviews")
    .select("*, games(title, slug)")
    .order("published_at", { ascending: false });

  const reviews = (reviewsData ?? []) as any[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Editor reviews</h1>
        <Link href="/admin/reviews/new" className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          + Write review
        </Link>
      </div>

      {reviews.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Game</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Author</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Score</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Published</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{review.games?.title ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{review.author}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-medium">{review.score_overall}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(review.published_at)}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={"/admin/reviews/new?edit=" + review.id} className="text-indigo-600 hover:underline text-xs mr-4">Edit</Link>
                    <Link href={"/games/" + review.games?.slug} className="text-gray-400 hover:underline text-xs" target="_blank">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No editor reviews yet.</p>
          <Link href="/admin/reviews/new" className="text-indigo-600 hover:underline text-sm">Write your first review</Link>
        </div>
      )}
    </div>
  );
}