import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scoreColor(score: number): { bg: string; color: string } {
  if (score >= 8) return { bg: "rgba(52,211,153,0.12)", color: "#059669" }
  if (score >= 6) return { bg: "rgba(96,165,250,0.12)", color: "#2563eb" }
  if (score >= 4) return { bg: "rgba(251,191,36,0.12)", color: "#d97706" }
  return { bg: "rgba(248,113,113,0.12)", color: "#dc2626" }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  })
}