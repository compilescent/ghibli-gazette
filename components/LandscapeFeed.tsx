"use client"

import { useRef } from "react"
import Link from "next/link"
import { type Post, categoryLabel, getPostCoverImage } from "@/lib/types"

interface LandscapeFeedProps {
  posts: Post[]
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
        padding: "36px 0 28px",
        background: "var(--bg-secondary)",
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--accent)", fontSize: "16px" }}>✦</span>
            <h2
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "18px",
                letterSpacing: "0.12em",
                color: "var(--text-primary)",
                margin: 0
              }}
            >
              SPOTLIGHT &amp; VISUAL FEEDS
            </h2>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => scroll("left")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              aria-label="Scroll right"
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
                  borderRadius: "10px",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  textDecoration: "none",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                  transition: "transform 0.25s ease, border-color 0.25s ease"
                }}
                className="landscape-card-hover"
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
                      "linear-gradient(to top, rgba(10, 11, 16, 0.95) 0%, rgba(10, 11, 16, 0.4) 60%, transparent 100%)"
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
                      fontSize: "9.5px",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                      letterSpacing: "0.1em",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      background: "var(--accent)",
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
                      fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                      fontSize: "14.5px",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.3,
                      margin: 0
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
