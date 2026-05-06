import { createClient } from "@/lib/supabase/server"
import type { DeveloperSpotlight } from "@/types/database"
import { SpotlightSubmitForm } from "@/components/developers/SpotlightSubmitForm"
import { DeveloperSpotlightGrid } from "@/components/developers/DeveloperSpotlightGrid"

export const metadata = {
  title: "Developer Spotlight",
  description: "Meet the indie developers building tomorrow's best games.",
}


export default async function DevelopersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("developer_spotlight")
    .select("*")
    .order("created_at", { ascending: false })

  const entries = (data ?? []) as DeveloperSpotlight[]
  const featured = entries.filter((e) => e.is_featured)
  const rest = entries.filter((e) => !e.is_featured)
  const all = [...featured, ...rest]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid rgba(109,40,217,0.1)", boxShadow: "0 2px 12px rgba(109,40,217,0.06)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px", letterSpacing: "-0.5px" }}>Developer Spotlight</h1>
        <p style={{ fontSize: "14px", color: "#6d60c0" }}>
          Meet the indie developers building tomorrow&apos;s best games.{" "}
          {all.length > 0 && <span style={{ fontWeight: 700, color: "#7c3aed" }}>{all.length} developer{all.length !== 1 ? "s" : ""} featured.</span>}
        </p>
      </div>

      <SpotlightSubmitForm />

      {all.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", border: "1px solid rgba(109,40,217,0.1)", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#9d8fc0" }}>No developer spotlights yet. Check back soon!</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid rgba(109,40,217,0.1)", boxShadow: "0 2px 12px rgba(109,40,217,0.06)", overflow: "hidden" }}>
          <DeveloperSpotlightGrid entries={all} />
        </div>
      )}
    </div>
  )
}
