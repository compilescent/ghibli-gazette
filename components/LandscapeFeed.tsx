"use client"

import { useRef } from "react"
import Link from "next/link"
import { type Post, categoryLabel, getPostCoverImage } from "@/lib/types"

interface LandscapeFeedProps {
  posts: Post[]
}

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

export default function LandscapeFeed({ posts }: LandscapeFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -400 : 400
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  const spotlightPosts = posts.slice(0, 8)
  if (spotlightPosts.length === 0) return null

  return (
    <section
      style={{
        padding: "24px 0 28px",
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
        position: "relative"
      }}
      aria-label="Spotlight Carousel"
    >
      <div className="shell">
        {/* Header with Navigation Arrows */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "3px", height: "22px", background: "var(--red)" }} />
            <h2
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "22px",
                letterSpacing: "0.08em",
                color: "var(--text)",
                margin: 0
              }}
            >
              SPOTLIGHT
            </h2>
            <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "10px", letterSpacing: "0.2em", color: "var(--red)", textTransform: "uppercase" }}>FEATURED VISUALS</span>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => scroll("left")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border2)",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              aria-label="Scroll left"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)" }}
            >
              ‹
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border2)",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              aria-label="Scroll right"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)" }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Scrollable Landscape Container */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "12px",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="landscape-scroll-container"
        >
          {spotlightPosts.map((post) => {
            const cover = getPostCoverImage(post)
            return (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                style={{
                  minWidth: "300px",
                  maxWidth: "340px",
                  height: "200px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  textDecoration: "none",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                  transition: "transform 0.2s ease, border-color 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--red)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)" }}
              >
                {/* Background Image */}
                <img
                  src={cover}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 60%, transparent 100%)"
                  }}
                />

                {/* Content Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end"
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                      letterSpacing: "0.1em",
                      padding: "2px 8px",
                      borderRadius: "3px",
                      background: getCategoryColor(post.category),
                      color: "#fff",
                      textTransform: "uppercase",
                      alignSelf: "flex-start",
                      marginBottom: "6px"
                    }}
                  >
                    {categoryLabel(post.category)}
                  </span>
                  <h3
                    className="line-clamp-2"
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.3,
                      margin: 0,
                      textShadow: "0 1px 4px rgba(0,0,0,0.8)"
                    }}
                  >
                    {post.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}