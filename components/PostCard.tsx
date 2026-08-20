"use client"

import Link from "next/link"
import { categoryLabel, getPostCoverImage } from "@/lib/types"
import type { Post } from "@/lib/types"
import ImageWithFallback from "./ImageWithFallback"
import { useBookmarks } from "./BookmarkDrawer"

function readTime(content?: string): number {
  if (!content) return 2
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const rt = readTime(post.content)
  const dateStr = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(post.date)
  )
  const imageUrl = getPostCoverImage(post)
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const saved = isBookmarked(post.id)

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
  }

  return (
    <article
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "all 0.2s ease",
        position: "relative"
      }}
    >
      <Link
        href={`/blog/${post.id}`}
        style={{ display: "flex", flexDirection: "column", flex: 1, textDecoration: "none" }}
      >
        {/* Top Real Image Panel (180px) */}
        <div
          style={{
            height: "180px",
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
            background: "var(--bg-elevated)"
          }}
        >
          <ImageWithFallback
            src={imageUrl}
            alt={post.title}
            className="card-image-hover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10, 10, 15, 0.6) 0%, transparent 60%)"
            }}
          />

          <span
            className="badge"
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
            }}
          >
            {categoryLabel(post.category)}
          </span>

          {/* 1-Click Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 3,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: saved ? "var(--accent)" : "rgba(10, 11, 16, 0.75)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "pointer",
              transition: "transform 0.15s ease, background 0.15s ease"
            }}
            title={saved ? "Remove from saved" : "Save for later"}
            aria-label={saved ? "Remove bookmark" : "Add bookmark"}
          >
            {saved ? "★" : "🔖"}
          </button>

          {(featured || post.featured) && (
            <span
              className="badge badge-gold"
              style={{
                position: "absolute",
                top: "12px",
                right: "44px",
                zIndex: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
              }}
            >
              ★ FEATURED
            </span>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3
            className="line-clamp-2 card-title-hover"
            style={{
              fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.4,
              marginBottom: "8px",
              transition: "color 0.2s ease"
            }}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p
              className="line-clamp-3"
              style={{
                fontFamily: "var(--font-inter, system-ui, sans-serif)",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "14px"
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Footer Metadata */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "var(--text-muted)",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
              fontFamily: "var(--font-inter, system-ui, sans-serif)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>{dateStr}</span>
              {post.views !== undefined && post.views > 0 && (
                <>
                  <span>·</span>
                  <span>{post.views} views</span>
                </>
              )}
            </div>
            <span>{rt} min read</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
