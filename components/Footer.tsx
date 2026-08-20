import Link from "next/link"
import { categories } from "@/lib/types"

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        padding: "48px 0 32px"
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
              Your premier source for Studio Ghibli news, anime reviews, and seasonal coverage.
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
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="footer-link"
                >
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
              <Link
                href="/"
                className="footer-link"
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="footer-link"
              >
                Write a Story
              </Link>
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
            © {new Date().getFullYear()} Ghibli Gazette. All rights reserved.
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Anime & Ghibli Editorial News</p>
        </div>
      </div>
    </footer>
  )
}
