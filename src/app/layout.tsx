import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Navbar } from "@/components/ui/Navbar"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"
import Link from "next/link"

export const metadata: Metadata = {
  title: { default: "IndieScout — Indie Game Reviews", template: "%s | IndieScout" },
  description: "Expert reviews and community opinions on the best indie games.",
  openGraph: { type: "website", siteName: "IndieScout" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AnimatedBackground />
        <Navbar />
        <main style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "0 16px 64px", flex: 1 }}>
          <div style={{ padding: "24px 0" }}>
            {children}
          </div>
        </main>
        <footer style={{ borderTop: "1px solid rgba(109,40,217,0.12)", padding: "24px 16px", textAlign: "center", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IndieScout</span>
            <span style={{ fontSize: "12px", color: "rgba(109,40,217,0.4)" }}>·</span>
            <Link href="/privacy" style={{ fontSize: "12px", color: "#5b21b6", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: "12px", color: "#5b21b6", textDecoration: "none", fontWeight: 500 }}>Terms of Service</Link>
            <span style={{ fontSize: "12px", color: "rgba(109,40,217,0.4)" }}>·</span>
            <span style={{ fontSize: "12px", color: "#5b21b6" }}>© {new Date().getFullYear()} IndieScout</span>
          </div>
        </footer>
      </body>
    </html>
  )
}