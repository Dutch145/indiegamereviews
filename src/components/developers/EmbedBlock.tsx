"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: Element | null) => void } }
  }
}

type EmbedBlockProps =
  | { type: "twitter"; html: string }
  | { type: "youtube"; videoId: string }
  | { type: "reddit"; iframeSrc: string }

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

  if (props.type === "reddit") {
    return (
      <iframe
        src={props.iframeSrc}
        style={{ width: "100%", height: "460px", border: "none", borderRadius: "8px", display: "block" }}
        title="Reddit embed"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    )
  }

  return <TwitterEmbed html={props.html} />
}

function TwitterEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [html])

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ fontSize: "13px" }}
    />
  )
}
