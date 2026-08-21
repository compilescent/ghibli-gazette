"use client"

import Link from "next/link"
import { useState } from "react"
import { categoryLabel, getPostCoverImage, categoryGradient } from "@/lib/types"
import type { Post } from "@/lib/types"
import ImageWithFallback from "./ImageWithFallback"
import { useBookmarks } from "./BookmarkDrawer"

function readTime(content?: string): number {
  if (!content) return 2
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    "ghibli-news": "linear-gradient(135deg, #1a1535, #2d1b69)",
    "new-release": "linear-gradient(135deg, #1a0a0a, #4a0f0f)",
    "review": "linear-gradient(135deg, #0a1a0f, #0f3d1f)",
    "premiere": "linear-gradient(135deg, #1a0a1a, #4a0f4a)",
    "general": "linear-gradient(135deg, #0a0f1a, #0f204a)",
    "anime-news": "linear-gradient(135deg, #1a100a, #4a2a0f)",
    "manga-news": "linear-gradient(135deg, #150a1a, #3a0f4a)",
    "industry": "linear-gradient(135deg, #0a1a18, #0f3a35)",
  }
  return gradients[category] || gradients["general"]
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

export default function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const rt = readTime(post.content)
  const dateStr = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(post.date)
  )
  const imageUrl = getPostCoverImage(post)
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const saved = isBookmarked(post.id)
  const [burst, setBurst] = useState(false)

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark({
      id: post.id,
      title: post.title,
      category: post.category,
      coverImage: imageUrl,
      date: post.date
    })
    if (!saved) {
      setBurst(true)
      setTimeout(() => setBurst(false), 650)
    }
  }

  return (
    <Link href={`/blog/${post.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Top Banner - Category Gradient (190px) */}
        <div
          style={{
            height: "190px",
            position: "relative",
            overflow: "hidden",
            background: getCategoryGradient(post.category),
            borderRadius: "6px 6px 0 0"
          }}
        >
          <ImageWithFallback
            src={imageUrl}
            alt={post.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.85
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.1) 100%)"
            }}
          />

          {/* Top Left Badge */}
          <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 2 }}>
            <span
              className="badge"
              style={{
                fontSize: "10px",
                padding: "2px 8px",
                background: getCategoryColor(post.category),
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
              }}
            >
              {categoryLabel(post.category).toUpperCase()}
            </span>
          </div>

          {/* Bottom Left: FROM THE WEB badge for auto posts */}
          {(post as any).aiGenerated && (
            <div style={{ position: "absolute", bottom: "12px", left: "12px", zIndex: 2 }}>
              <span
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "var(--text3)",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: "3px",
                  padding: "2px 8px"
                }}
              >
                FROM THE WEB
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {(featured || post.featured) && (
            <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2 }}>
              <span
                className="badge badge-gold"
                style={{
                  fontSize: "10px",
                  padding: "2px 8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
                }}
              >
                ★ FEATURED
              </span>
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 2,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              cursor: "pointer",
              background: saved ? "var(--red)" : "rgba(10, 10, 15, 0.75)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              transition: "all 0.15s ease"
            }}
            title={saved ? "Remove from saved" : "Save for later"}
            aria-label={saved ? "Remove bookmark" : "Add bookmark"}
          >
            {burst && <span style={{ position: "absolute", animation: "sparkleBurst 0.6s ease-out forwards" }}>✦</span>}
            {saved ? "★" : "🔖"}
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3
            className="font-playfair"
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text)",
              lineHeight: 1.35,
              marginBottom: "8px",
              transition: "color 0.15s ease",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p
              className="line-clamp-3"
              style={{
                fontFamily: "var(--font-inter, system-ui, sans-serif)",
                fontSize: "12px",
                color: "var(--text2)",
                lineHeight: 1.5,
                marginBottom: "12px"
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Bottom Meta */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--red)", fontWeight: 500 }}>
                {post.author}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--text3)" }}>
                {dateStr}
              </span>
              <span style={{ color: "var(--text3)" }}>·</span>
              <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--text3)" }}>
                {rt} min read
              </span>
            </div>
          </div>

          {/* Read More - slides up on hover */}
          <div
            style={{
              marginTop: "12px",
              opacity: 0,
              transform: "translateY(8px)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)" }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; e.currentTarget.style.transform = "translateY(8px)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                color: "var(--red)"
              }}
            >
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}