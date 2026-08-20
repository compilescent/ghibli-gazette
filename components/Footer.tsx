import Link from "next/link"
import { categories } from "@/lib/types"
import { getSiteSettings } from "@/lib/posts"

export default async function Footer() {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || "Ghibli Gazette"

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        padding: "48px 0 32px"
      }}
    >
      <div className="shell">
        {/* Newsletter CTA Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "20px 24px",
            marginBottom: "40px",
            borderRadius: "10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)"
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              📬 Never miss an anime drop
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>
              Daily morning briefing on anime, manga, and industry intel — straight to your inbox.
            </p>
          </div>
          <Link href="/#latest-stories-section" className="btn btn-primary" style={{ borderRadius: "999px" }}>
            Subscribe Now
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "40px"
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "22px", color: "var(--accent)" }}>
                GHIBLI
              </span>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  margin: "0 4px"
                }}
              />
              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "22px", color: "var(--text-primary)" }}>
                GAZETTE
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "260px" }}>
              {settings.tagline || "Your anime & manga news hub: reviews, releases, premieres, and industry intel."}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                marginBottom: "16px"
              }}
            >
              CATEGORIES
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="footer-link">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                marginBottom: "16px"
              }}
            >
              NAVIGATE
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/archive" className="footer-link">Full Archive</Link>
              <Link href="/rss.xml" className="footer-link">RSS Feed</Link>
              <Link href="/admin" className="footer-link">Write a Story</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                marginBottom: "16px"
              }}
            >
              ABOUT
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/about" className="footer-link">About {siteName}</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Anime & Manga News Hub</p>
        </div>
      </div>
    </footer>
  )
}