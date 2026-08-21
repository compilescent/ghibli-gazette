"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import SearchModal from "./SearchModal"
import BookmarkDrawer, { useBookmarks } from "./BookmarkDrawer"
import { ThemeToggle } from "./ThemeToggle"
import { useDialog } from "@/lib/useDialog"

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/category/anime-news", label: "NEWS" },
  { href: "/category/manga-news", label: "MANGA" },
  { href: "/category/review", label: "REVIEWS" },
  { href: "/category/new-release", label: "RELEASES" },
  { href: "/category/premiere", label: "PREMIERES" },
  { href: "/category/ghibli-news", label: "GHIBLI" }
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const pathname = usePathname()
  const { bookmarks } = useBookmarks()
  const drawerRef = useDialog(menuOpen, () => setMenuOpen(false))

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
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: "-100px",
          left: "16px",
          padding: "8px 16px",
          background: "var(--red)",
          color: "#fff",
          fontWeight: 700,
          borderRadius: "4px",
          zIndex: 1000,
          transition: "top 0.2s ease"
        }}
        onFocus={(e) => (e.currentTarget.style.top = "16px")}
        onBlur={(e) => (e.currentTarget.style.top = "-100px")}
      >
        Skip to main content
      </a>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "56px",
          background: "rgba(10,10,15,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", height: "100%", alignContent: "center" }}>
            <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "26px", color: "var(--red)", lineHeight: 1, letterSpacing: "0.03em" }}>
              GHIBLI
            </span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--red)",
                margin: "0 8px",
                animation: "pulse-dot 3s ease-in-out infinite",
                display: "inline-block",
                verticalAlign: "middle"
              }}
            />
            <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "26px", color: "var(--text)", lineHeight: 1, letterSpacing: "0.03em" }}>
              GAZETTE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "4px" }} aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right section: Search + Bookmarks + Write + Mobile Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg3)",
                border: "1px solid var(--border2)",
                borderRadius: "999px",
                padding: "5px 12px",
                color: "var(--text2)",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--text)" }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)" }}
              title="Search stories (Ctrl+K)"
              aria-label="Search stories"
            >
              <span style={{ fontSize: "14px" }}>🔍</span>
              <span className="hide-mobile">Search</span>
              <span
                className="hide-mobile"
                style={{
                  fontSize: "10px",
                  padding: "1px 5px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  color: "var(--text3)",
                  fontFamily: "monospace"
                }}
              >
                ⌘K
              </span>
            </button>

            {/* Divider */}
            <div style={{ width: "1px", height: "20px", background: "var(--border2)", margin: "0 4px" }} />

            {/* Write Button */}
            <Link
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--red)",
                color: "#fff",
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                padding: "6px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--red2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--red)"}
            >
              WRITE
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
              aria-expanded={menuOpen}
            >
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text)", borderRadius: "1px" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text)", borderRadius: "1px" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text)", borderRadius: "1px" }} />
            </button>
          </div>
        </div>
      </header>
      <div style={{ height: "56px" }} aria-hidden="true" />

      {/* Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Saved Bookmarks Drawer */}
      <BookmarkDrawer isOpen={bookmarkOpen} onClose={() => setBookmarkOpen(false)} />

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          ref={drawerRef}
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
              background: "var(--bg2)",
              borderLeft: "1px solid var(--border)",
              padding: "70px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile Navigation"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "20px", color: "var(--red)" }}>
                MENU
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text3)", fontSize: "20px", cursor: "pointer" }}
                aria-label="Close menu"
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
                color: "var(--text)",
                borderRadius: "6px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                marginBottom: "8px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span>🔍</span>
              <span>Search Stories...</span>
            </button>

            {/* Mobile bookmarks trigger */}
            <button
              onClick={() => {
                setMenuOpen(false)
                setBookmarkOpen(true)
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text)",
                borderRadius: "6px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                marginBottom: "12px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span>🔖</span>
              <span>Saved Stories ({bookmarks.length})</span>
            </button>

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "10px 14px",
                fontSize: "14px",
                fontWeight: 600,
                color: pathname === "/" ? "var(--red)" : "var(--text2)",
                borderRadius: "6px",
                background: pathname === "/" ? "var(--bg3)" : "transparent"
              }}
            >
              Home
            </Link>
            {navLinks.slice(1).map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href)
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
                    color: active ? "var(--red)" : "var(--text2)",
                    borderRadius: "6px",
                    background: active ? "var(--bg3)" : "transparent"
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--red)",
                color: "#fff",
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                padding: "6px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                marginTop: "20px",
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--red2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--red)"}
            >
              WRITE
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}