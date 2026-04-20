"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";

const scoreFields = [
  { key: "score_gameplay",      label: "Gameplay" },
  { key: "score_visuals",       label: "Visuals" },
  { key: "score_replayability", label: "Replayability" },
  { key: "score_audio",         label: "Audio" },
] as const;

type ScoreKey = typeof scoreFields[number]["key"];

export default function NewReviewPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const supabase = createClient();

  const [games, setGames] = useState<Array<{ id: string; title: string }>>([]);
  const [gameId, setGameId] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [verdict, setVerdict] = useState("");
  const [scoreOverall, setScoreOverall] = useState("8.0");
  const [subScores, setSubScores] = useState<Record<ScoreKey, string>>({
    score_gameplay: "",
    score_visuals: "",
    score_replayability: "",
    score_audio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (supabase as any).from("games").select("id, title").order("title").then(({ data }: any) => {
      if (data) setGames(data);
    });

    if (editId) {
      (supabase as any).from("editor_reviews").select("*").eq("id", editId).single().then(({ data }: any) => {
        if (!data) return;
        setGameId(data.game_id);
        setAuthor(data.author);
        setSummary(data.summary);
        setVerdict(data.verdict);
        setScoreOverall(data.score_overall.toString());
        setSubScores({
          score_gameplay: data.score_gameplay?.toString() ?? "",
          score_visuals: data.score_visuals?.toString() ?? "",
          score_replayability: data.score_replayability?.toString() ?? "",
          score_audio: data.score_audio?.toString() ?? "",
        });
      });
    }
  }, [editId]);

  async function handleSubmit() {
    if (!gameId || !author.trim() || !summary.trim() || !verdict.trim()) {
      setError("Game, author, summary, and verdict are required.");
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      game_id: gameId,
      author: author.trim(),
      summary: summary.trim(),
      verdict: verdict.trim(),
      score_overall: parseFloat(scoreOverall),
      score_gameplay: subScores.score_gameplay ? parseFloat(subScores.score_gameplay) : null,
      score_visuals: subScores.score_visuals ? parseFloat(subScores.score_visuals) : null,
      score_replayability: subScores.score_replayability ? parseFloat(subScores.score_replayability) : null,
      score_audio: subScores.score_audio ? parseFloat(subScores.score_audio) : null,
    };

    const { error: err } = editId
      ? await (supabase as any).from("editor_reviews").update(payload).eq("id", editId)
      : await (supabase as any).from("editor_reviews").insert(payload);

    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
        <h1 className="text-2xl font-semibold">{editId ? "Edit review" : "Write editor review"}</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Game *">
            <select className={inputClass} value={gameId} onChange={(e) => setGameId(e.target.value)}>
              <option value="">Select a game...</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Author *">
            <input className={inputClass} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Staff Reviewer" />
          </Field>
        </div>

        <Field label="Overall score (0-10) *">
          <div className="flex items-center gap-4">
            <input type="range" min={0} max={10} step={0.1} value={scoreOverall} onChange={(e) => setScoreOverall(e.target.value)} className="flex-1 accent-indigo-600" />
            <span className="text-lg font-semibold text-indigo-600 w-10 text-center">{parseFloat(scoreOverall).toFixed(1)}</span>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          {scoreFields.map(({ key, label }) => (
            <Field key={key} label={label + " score (optional)"}>
              <input className={inputClass} type="number" min={0} max={10} step={0.1} value={subScores[key]} onChange={(e) => setSubScores((s) => ({ ...s, [key]: e.target.value }))} placeholder="e.g. 8.5" />
            </Field>
          ))}
        </div>

        <Field label="Review body *">
          <textarea className={textareaClass} rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Write the full review here..." />
        </Field>

        <Field label="Verdict *">
          <textarea className={textareaClass} rows={2} value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="A short closing verdict sentence..." />
        </Field>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {loading ? "Saving..." : editId ? "Save changes" : "Publish review"}
          </button>
          <button onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
      </div>
    </div>
  );
}