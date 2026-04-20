import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "IndieScope — Indie Game Reviews",
    template: "%s | IndieScout",
  },
  description: "Expert reviews and community opinions on the best indie games. Discover hidden gems, trending titles, and editor picks.",
  keywords: ["indie games", "game reviews", "indie game reviews", "gaming"],
  openGraph: {
  type: "website",
  siteName: "IndieScout",
  title: "IndieScout — Indie Game Reviews",
  description: "Expert reviews and community opinions on the best indie games.",
},
twitter: {
  card: "summary_large_image",
  title: "IndieScout — Indie Game Reviews",
  description: "Expert reviews and community opinions on the best indie games.",
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}