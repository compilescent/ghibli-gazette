"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navLinks = [
  { href: "/category/ghibli-news", label: "News" },
  { href: "/category/review", label: "Reviews" },
  { href: "/category/new-release", label: "Releases" },
  { href: "/category/premiere", label: "Premieres" },
  { href: "/category/general", label: "General" }
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: "60px",
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "28px", color: "var(--accent)", lineHeight: 1, letterSpacing: "0.03em" }}>
              GHIBLI
            </span>
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--accent)",
                margin: "0 6px",
                animation: "pulse-dot 2s ease-in-out infinite",
                display: "inline-block"
              }}
            />
            <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "28px", color: "#F0EEE8", lineHeight: 1, letterSpacing: "0.03em" }}>
              GAZETTE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  {link.label}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: "14px",
                        right: "14px",
                        height: "2px",
                        background: "var(--accent)",
                        borderRadius: "1px"
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right section */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              href="/admin"
              className="btn btn-primary hide-mobile"
              style={{
                fontFamily: "var(--font-inter, system-ui, sans-serif)",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "999px",
                padding: "6px 16px",
                minHeight: "auto"
              }}
            >
              Write
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="hide-desktop"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "5px"
              }}
              aria-label="Toggle Navigation Menu"
            >
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-primary)", borderRadius: "1px" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-primary)", borderRadius: "1px" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text-primary)", borderRadius: "1px" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setMenuOpen(false)}
        >
          <nav
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "280px",
              background: "var(--bg-secondary)",
              borderLeft: "1px solid var(--border)",
              padding: "70px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "20px", color: "var(--accent)" }}>
                MENU
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 600,
                color: pathname === "/" ? "var(--accent)" : "var(--text-secondary)",
                borderRadius: "6px",
                background: pathname === "/" ? "var(--bg-elevated)" : "transparent"
              }}
            >
              Home
            </Link>
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    borderRadius: "6px",
                    background: active ? "var(--bg-elevated)" : "transparent"
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: "20px", width: "100%", justifyContent: "center" }}
            >
              Write a Story
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
