"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: Element | null) => void } }
  }
}

type EmbedBlockProps =
  | { type: "twitter" | "reddit"; html: string }
  | { type: "youtube"; videoId: string }

export function EmbedBlock(props: EmbedBlockProps) {
  if (props.type === "youtube") {
    return (
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px", background: "#000" }}>
        <iframe
          src={`https://www.youtube.com/embed/${props.videoId}`}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube embed"
        />
      </div>
    )
  }

  return <OembedEmbed html={props.html} type={props.type} />
}

function OembedEmbed({ html, type }: { html: string; type: "twitter" | "reddit" }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (type === "twitter") {
      function loadTwitter() {
        if (window.twttr?.widgets && ref.current) {
          window.twttr.widgets.load(ref.current)
        }
      }
      if (window.twttr) {
        loadTwitter()
      } else if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
        const s = document.createElement("script")
        s.src = "https://platform.twitter.com/widgets.js"
        s.async = true
        s.charset = "utf-8"
        s.onload = loadTwitter
        document.body.appendChild(s)
      }
    } else if (type === "reddit") {
      // Always remove + re-inject so the script re-scans after React sets innerHTML
      const existing = document.querySelector('script[src="https://embed.reddit.com/en/public.js"]')
      if (existing) existing.remove()
      const s = document.createElement("script")
      s.src = "https://embed.reddit.com/en/public.js"
      s.async = true
      document.body.appendChild(s)
    }
  }, [html, type])

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ fontSize: "13px" }}
    />
  )
}
