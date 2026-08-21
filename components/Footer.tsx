import Link from "next/link"
import { categories } from "@/lib/types"
import { getSiteSettings } from "@/lib/posts"

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "ghibli-news": "#667eea",
    "new-release": "#E8392A",
    "review": "#2ECC71",
    "premiere": "#C94FAE",
    "general": "#4A8FE8",
    "anime-news": "#FF6B35",
    "manga-news": "#9B59B6",
    "industry": "#1ABC9C",
  }
  return colors[category] || colors["general"]
}

export default async function Footer() {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || "Ghibli Gazette"

  return (
    <footer
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        padding: "40px 0 20px"
      }}
    >
      <div className="shell">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "40px"
          }}
        >
          {/* Left: Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "24px", color: "var(--red)" }}>
                GHIBLI
              </span>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--red)",
                  margin: "0 4px"
                }}
              />
              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "24px", color: "var(--text)" }}>
                GAZETTE
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.7, maxWidth: "260px" }}>
              {settings.tagline || "Your anime & manga news hub: reviews, releases, premieres, and industry intel."}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <a
                href={settings.twitter || "#"}
                className="social-icon"
                aria-label="Twitter"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border)", color: "var(--text2)", fontSize: "14px", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)" }}
              >
                𝕏
              </a>
              <a
                href={settings.discord || "#"}
                className="social-icon"
                aria-label="Discord"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border)", color: "var(--text2)", fontSize: "14px", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)" }}
              >
                💬
              </a>
              <a
                href={settings.instagram || "#"}
                className="social-icon"
                aria-label="Instagram"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border)", color: "var(--text2)", fontSize: "14px", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)" }}
              >
                📷
              </a>
              <a
                href="/rss.xml"
                className="social-icon"
                aria-label="RSS Feed"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border)", color: "var(--text2)", fontSize: "14px", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)" }}
              >
                📡
              </a>
            </div>
          </div>

          {/* Center: Categories */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "var(--text3)",
                marginBottom: "16px",
                textTransform: "uppercase"
              }}
            >
              CATEGORIES
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Navigate */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "var(--text3)",
                marginBottom: "16px",
                textTransform: "uppercase"
              }}
            >
              NAVIGATE
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>Home</Link>
              <Link href="/archive" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>Full Archive</Link>
              <Link href="/rss.xml" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>RSS Feed</Link>
              <Link href="/admin" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>Write a Story</Link>
              <Link href="/about" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>About</Link>
              <Link href="/contact" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>Contact</Link>
              <Link href="/privacy" className="footer-link" style={{ fontSize: "12px", color: "var(--text2)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <p style={{ fontSize: "11px", color: "var(--text3)" }}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/privacy" style={{ fontSize: "11px", color: "var(--text3)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: "11px", color: "var(--text3)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}