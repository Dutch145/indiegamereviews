import { EditorReview } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface Props {
  review: EditorReview;
}

const scoreCategories = [
  { key: "score_gameplay" as const,      label: "Gameplay" },
  { key: "score_visuals" as const,       label: "Visuals" },
  { key: "score_replayability" as const, label: "Replayability" },
  { key: "score_audio" as const,         label: "Audio" },
];

export function EditorReviewSection({ review }: Props) {
  return (
    <section>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
        Editor's review
      </p>

      <p className="text-gray-600 leading-relaxed">{review.summary}</p>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
        <p className="text-sm">
          <span className="font-medium">Verdict: </span>
          <span className="text-gray-600">{review.verdict}</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {scoreCategories.map(({ key, label }) => {
          const val = review[key];
          if (val === null) return null;
          return (
            <div key={key}>
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(val / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{val}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        By {review.author} · {formatDate(review.published_at)}
      </p>
    </section>
  );
}
