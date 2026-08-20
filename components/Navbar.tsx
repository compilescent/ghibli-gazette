"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import SearchModal from "./SearchModal"

const navLinks = [
  { href: "/category/ghibli-news", label: "News" },
  { href: "/category/review", label: "Reviews" },
  { href: "/category/new-release", label: "Releases" },
  { href: "/category/premiere", label: "Premieres" },
  { href: "/category/general", label: "General" }
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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

          {/* Right section: Search + Write + Mobile Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: "999px",
                padding: "5px 12px",
                color: "var(--text-secondary)",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              className="search-btn-hover"
              title="Search stories (Ctrl+K)"
            >
              <span>🔍</span>
              <span className="hide-mobile">Search</span>
              <span
                className="hide-mobile"
                style={{
                  fontSize: "10px",
                  padding: "1px 5px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  color: "var(--text-muted)",
                  fontFamily: "monospace"
                }}
              >
                ⌘K
              </span>
            </button>

            {/* Write Button */}
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

      {/* Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

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

            {/* Mobile search trigger */}
            <button
              onClick={() => {
                setMenuOpen(false)
                setSearchOpen(true)
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                borderRadius: "6px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                marginBottom: "8px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span>🔍</span>
              <span>Search Stories...</span>
            </button>

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
