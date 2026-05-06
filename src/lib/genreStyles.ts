export type GenreStyle = { color: string; bg: string; border: string }

export const GENRE_STYLES: Record<string, GenreStyle> = {
  "Action":               { color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.55)" },
  "Adventure":            { color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.55)" },
  "RPG":                  { color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.55)" },
  "Puzzle":               { color: "#0891b2", bg: "rgba(8,145,178,0.08)",   border: "rgba(8,145,178,0.55)" },
  "Horror":               { color: "#9f1239", bg: "rgba(159,18,57,0.08)",   border: "rgba(159,18,57,0.55)" },
  "Survival Horror":      { color: "#9f1239", bg: "rgba(159,18,57,0.08)",   border: "rgba(159,18,57,0.55)" },
  "Strategy":             { color: "#1d4ed8", bg: "rgba(29,78,216,0.08)",   border: "rgba(29,78,216,0.55)" },
  "City Builder":         { color: "#1d4ed8", bg: "rgba(29,78,216,0.08)",   border: "rgba(29,78,216,0.55)" },
  "Simulation":           { color: "#0284c7", bg: "rgba(2,132,199,0.08)",   border: "rgba(2,132,199,0.55)" },
  "Farming":              { color: "#65a30d", bg: "rgba(101,163,13,0.08)",  border: "rgba(101,163,13,0.55)" },
  "Fishing":              { color: "#0369a1", bg: "rgba(3,105,161,0.08)",   border: "rgba(3,105,161,0.55)" },
  "Platformer":           { color: "#ea580c", bg: "rgba(234,88,12,0.08)",   border: "rgba(234,88,12,0.55)" },
  "Precision Platformer": { color: "#ea580c", bg: "rgba(234,88,12,0.08)",   border: "rgba(234,88,12,0.55)" },
  "Roguelike":            { color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.55)" },
  "Roguelite":            { color: "#6d28d9", bg: "rgba(109,40,217,0.08)",  border: "rgba(109,40,217,0.55)" },
  "Metroidvania":         { color: "#4f46e5", bg: "rgba(79,70,229,0.08)",   border: "rgba(79,70,229,0.55)" },
  "Card Game":            { color: "#db2777", bg: "rgba(219,39,119,0.08)",  border: "rgba(219,39,119,0.55)" },
  "Deckbuilding":         { color: "#db2777", bg: "rgba(219,39,119,0.08)",  border: "rgba(219,39,119,0.55)" },
  "Survival":             { color: "#4d7c0f", bg: "rgba(77,124,15,0.08)",   border: "rgba(77,124,15,0.55)" },
  "Driving":              { color: "#b45309", bg: "rgba(180,83,9,0.08)",    border: "rgba(180,83,9,0.55)" },
  "Narrative":            { color: "#0f766e", bg: "rgba(15,118,110,0.08)",  border: "rgba(15,118,110,0.55)" },
  "Exploration":          { color: "#047857", bg: "rgba(4,120,87,0.08)",    border: "rgba(4,120,87,0.55)" },
  "Multiplayer":          { color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.55)" },
  "Soulslike":            { color: "#475569", bg: "rgba(71,85,105,0.08)",   border: "rgba(71,85,105,0.55)" },
  "Dungeon Crawler":      { color: "#92400e", bg: "rgba(146,64,14,0.08)",   border: "rgba(146,64,14,0.55)" },
  "Run and Gun":          { color: "#b91c1c", bg: "rgba(185,28,28,0.08)",   border: "rgba(185,28,28,0.55)" },
  "Creature Collector":   { color: "#0d9488", bg: "rgba(13,148,136,0.08)",  border: "rgba(13,148,136,0.55)" },
  "Shooter":              { color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.55)" },
  "Tactical":             { color: "#365314", bg: "rgba(54,83,20,0.08)",    border: "rgba(54,83,20,0.55)" },
  "Top-Down":             { color: "#3730a3", bg: "rgba(55,48,163,0.08)",   border: "rgba(55,48,163,0.55)" },
  "Cyberpunk":            { color: "#06b6d4", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.55)" },
  "Typing":               { color: "#0f766e", bg: "rgba(15,118,110,0.08)",  border: "rgba(15,118,110,0.55)" },
  "Indie":                { color: "#7c3aed", bg: "rgba(124,58,237,0.07)",  border: "rgba(124,58,237,0.25)" },
}

export const DEFAULT_GENRE_STYLE: GenreStyle = {
  color: "#7c3aed", bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.2)",
}

export function getGenreStyle(genre: string): GenreStyle {
  return GENRE_STYLES[genre] ?? DEFAULT_GENRE_STYLE
}
