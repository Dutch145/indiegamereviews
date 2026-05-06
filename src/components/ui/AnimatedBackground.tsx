"use client"

export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: -1, overflow: "hidden",
        background: "linear-gradient(135deg, #e8e0ff 0%, #ede9ff 50%, #e0e8ff 100%)",
      }}
    >
      <div className="liq-blob liq-1" />
      <div className="liq-blob liq-2" />
      <div className="liq-blob liq-3" />
      <div className="liq-blob liq-4" />
      <div className="liq-blob liq-5" />
    </div>
  )
}
