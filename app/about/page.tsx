import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MascotButton from "@/components/MascotButton"

export const metadata: Metadata = {
  title: "About",
  description: "About Ghibli Gazette — your anime & manga news hub."
}

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="shell" style={{ flex: 1, maxWidth: "720px", padding: "48px 0 80px" }}>
        <p style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "13px", letterSpacing: "0.2em", color: "var(--accent)", marginBottom: "8px" }}>
          ABOUT THE HUB
        </p>
        <h1 style={{ fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          All anime. All manga. One Gazette.
        </h1>
        <div className="prose-article" style={{ marginTop: "24px" }}>
          <p>
            Ghibli Gazette started as a celebration of Studio Ghibli — and it still is. But the anime world is far too big for one studio.
            So we expanded into a full anime &amp; manga news hub covering breaking anime news, manga updates, reviews, new releases,
            seasonal premieres, and industry intel.
          </p>
          <h2>What we cover</h2>
          <ul>
            <li><strong>Anime News</strong> — announcements, adaptations, trailers, and everything in between.</li>
            <li><strong>Manga News</strong> — chapter drops, volume releases, serializations, and print editions.</li>
            <li><strong>Reviews</strong> — thoughtful analysis of series, films, and chapters.</li>
            <li><strong>Releases &amp; Premieres</strong> — seasonal calendars with countdowns so you never miss a drop.</li>
            <li><strong>Industry Intel</strong> — studios, staff, box office, and the business behind the animation.</li>
          </ul>
          <h2>How we work</h2>
          <p>
            Our AI news agent scans top anime outlets daily, deduplicates and rewrites stories into editorial-quality drafts,
            and places them in a review queue. Our editors review every story before it goes live — then you get it fresh
            in your inbox each morning at 6 AM.
          </p>
          <p>
            Want to see everything we've published?{" "}
            <Link href="/archive" style={{ color: "var(--accent)", textDecoration: "underline" }}>Browse the full archive →</Link>
          </p>
        </div>
      </div>
      <Footer />
      <MascotButton />
    </main>
  )
}