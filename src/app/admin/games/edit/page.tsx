"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";

export default function EditGamePage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genres, setGenres] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSpotlight, setIsSpotlight] = useState(false);
  const [spotlightQuote, setSpotlightQuote] = useState("");
  const [editorPickLabel, setEditorPickLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("games").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setDeveloper(data.developer);
        setPublisher(data.publisher ?? "");
        setReleaseYear(data.release_year?.toString() ?? "");
        setGenres(data.genres.join(", "));
        setPlatforms(data.platforms.join(", "));
        setDescription(data.description ?? "");
        setCoverUrl(data.cover_url ?? "");
        setBannerUrl(data.banner_url ?? "");
        setIsFeatured(data.is_featured ?? false);
        setIsSpotlight(data.is_spotlight ?? false);
        setSpotlightQuote(data.spotlight_quote ?? "");
        setEditorPickLabel(data.editor_pick_label ?? "");
      }
      setFetching(false);
    });
  }, [id]);

  async function handleSubmit() {
    if (!id) return;
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.from("games").update({
      title: title.trim(), developer: developer.trim(),
      publisher: publisher.trim() || null,
      release_year: releaseYear ? parseInt(releaseYear) : null,
      genres: genres.split(",").map((g) => g.trim()).filter(Boolean),
      platforms: platforms.split(",").map((p) => p.trim()).filter(Boolean),
      description: description.trim() || null,
      cover_url: coverUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      is_featured: isFeatured,
      is_spotlight: isSpotlight,
      spotlight_quote: spotlightQuote.trim() || null,
      editor_pick_label: editorPickLabel.trim() || null,
    }).eq("id", id);

    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/admin/games");
    router.refresh();
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this game and all its reviews? This cannot be undone.")) return;
    await supabase.from("games").delete().eq("id", id);
    router.push("/admin/games");
    router.refresh();
  }

  if (fetching) return <p className="text-gray-400 text-sm">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
        <h1 className="text-2xl font-semibold">Edit game</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Slug (read-only)">
            <input className={`${inputClass} bg-gray-50 text-gray-400`} value={slug} readOnly />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Developer">
            <input className={inputClass} value={developer} onChange={(e) => setDeveloper(e.target.value)} />
          </Field>
          <Field label="Publisher">
            <input className={inputClass} value={publisher} onChange={(e) => setPublisher(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Release year">
            <input className={inputClass} type="number" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />
          </Field>
          <Field label="Genres (comma-separated)">
            <input className={inputClass} value={genres} onChange={(e) => setGenres(e.target.value)} />
          </Field>
        </div>

        <Field label="Platforms (comma-separated)">
          <input className={inputClass} value={platforms} onChange={(e) => setPlatforms(e.target.value)} />
        </Field>

        <Field label="Description">
          <textarea className={textareaClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cover image URL">
            <input className={inputClass} value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
          </Field>
          <Field label="Banner image URL">
            <input className={inputClass} value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
          </Field>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-sm font-medium text-gray-700">Homepage curation</p>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span className="text-sm text-gray-700">Featured game <span className="text-gray-400">(hero banner)</span></span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isSpotlight} onChange={(e) => setIsSpotlight(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <span className="text-sm text-gray-700">Indie spotlight</span>
            </label>
          </div>

          {isSpotlight && (
            <Field label="Spotlight quote (optional)">
              <textarea className={textareaClass} rows={2} value={spotlightQuote} onChange={(e) => setSpotlightQuote(e.target.value)} placeholder="A short editorial quote for the spotlight section..." />
            </Field>
          )}

          <Field label="Editor pick label (optional)">
            <input className={inputClass} value={editorPickLabel} onChange={(e) => setEditorPickLabel(e.target.value)} placeholder="e.g. Best Roguelike 2024" />
          </Field>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {loading ? "Saving..." : "Save changes"}
            </button>
            <button onClick={() => router.back()} className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 transition-colors">
            Delete game
          </button>
        </div>
      </div>
    </div>
  );
}