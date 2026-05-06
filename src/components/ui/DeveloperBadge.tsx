"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function DeveloperBadge() {
  const [visible, setVisible] = useState(false)
  const [popping, setPopping] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("devBadgeDismissed")) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    setPopping(true)
    setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem("devBadgeDismissed", "1")
    }, 280)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes badgeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes badgePop {
          0%   { opacity: 1; transform: scale(1); }
          40%  { opacity: 1; transform: scale(1.08); }
          100% { opacity: 0; transform: scale(0.7); }
        }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: "28px",
        right: "24px",
        zIndex: 90,
        animation: popping ? "badgePop 0.28s ease forwards" : "badgeIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        maxWidth: "260px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          borderRadius: "16px",
          padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(124,58,237,0.4), 0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}>
          <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>👾</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: "8px" }}>
              Check out some indie developers!
            </p>
            <Link
              href="/developers"
              onClick={dismiss}
              style={{ fontSize: "12px", fontWeight: 700, color: "#c4b5fd", background: "rgba(255,255,255,0.15)", padding: "5px 12px", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
            >
              View spotlight →
            </Link>
          </div>
          <button
            onClick={dismiss}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "6px", width: "22px", height: "22px", fontSize: "12px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, minHeight: "auto" }}
          >
            ✕
          </button>
        </div>
      </div>
    </>
  )
}
