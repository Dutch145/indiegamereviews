"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: Element | null) => void } }
  }
}

export function TweetEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function loadWidgets() {
      if (window.twttr?.widgets && ref.current) {
        window.twttr.widgets.load(ref.current)
      }
    }

    if (window.twttr) {
      loadWidgets()
    } else if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
      const script = document.createElement("script")
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      script.charset = "utf-8"
      script.onload = loadWidgets
      document.body.appendChild(script)
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
