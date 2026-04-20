"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  gameId: string;
  userId: string;
  onSuccess: () => void;
}

export function ReviewForm({ gameId, userId, onSuccess }: Props) {
  const [score, setScore] = useState(8);
  const [body, setBody] = useState("");
  const [pros, setPros] = useState<string[]>(["", "", ""]);
  const [cons, setCons] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  function updatePro(index: number, value: string) {
    setPros((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  function updateCon(index: number, value: string) {
    setCons((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  async function handleSubmit() {
    if (!body.trim()) {
      setError("Please write a review.");
      return;
    }
    setLoading(true);
    setError(null);

    const cleanPros = pros.map((p) => p.trim()).filter(Boolean);
    const cleanCons = cons.map((c) => c.trim()).filter(Boolean);

    const { error: err } = await supabase.from("community_reviews").insert({
      game_id: gameId,
      user_id: userId,
      score,
      body: body.trim(),
      review_type: "quick",
      pros: cleanPros,
      cons: cleanCons,
    });

    setLoading(false);
    if (err) {
      setError(
        err.message.includes("unique") || err.code === "23505"
          ? "You've already reviewed this game. You can delete your existing review from your profile."
          : err.message
      );
      return;
    }
    router.refresh();
    onSuccess();
  }

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-5">

      {/* Score */}
      <div>
        <label className="text-sm font-medium block mb-1">
          Your score: <span className="text-indigo-600">{score}</span>
        </label>
        <input
          type="range" min={0} max={10} step={0.5}
          value={score}
          onChange={(e) => setScore(parseFloat(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>0</span><span>10</span>
        </div>
      </div>

      {/* Review body */}
      <div>
        <label className="text-sm font-medium block mb-1">Your review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Share your overall thoughts on this game..."
          className="w-full text-sm rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
        />
      </div>

      {/* Pros */}
      <div>
        <label className="text-sm font-medium block mb-2">
          <span className="text-green-600">+</span> Pros <span className="text-gray-400 font-normal">(optional, up to 3)</span>
        </label>
        <div className="space-y-2">
          {pros.map((pro, i) => (
            <input
              key={i}
              type="text"
              value={pro}
              onChange={(e) => updatePro(i, e.target.value)}
              placeholder={`Pro ${i + 1}...`}
              className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            />
          ))}
        </div>
      </div>

      {/* Cons */}
      <div>
        <label className="text-sm font-medium block mb-2">
          <span className="text-red-500">−</span> Cons <span className="text-gray-400 font-normal">(optional, up to 3)</span>
        </label>
        <div className="space-y-2">
          {cons.map((con, i) => (
            <input
              key={i}
              type="text"
              value={con}
              onChange={(e) => updateCon(i, e.target.value)}
              placeholder={`Con ${i + 1}...`}
              className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </div>
  );
}