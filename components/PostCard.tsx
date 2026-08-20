import Link from "next/link"
import { categoryLabel, getPostCoverImage } from "@/lib/types"
import type { Post } from "@/lib/types"

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
        transition: "all 0.2s ease"
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
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease"
            }}
            className="card-image-hover"
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
          {(featured || post.featured) && (
            <span
              className="badge badge-gold"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
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
                marginBottom: "12px"
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Bottom Meta Row */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-inter, system-ui, sans-serif)",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)"
            }}
          >
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {post.author?.trim() || "Ghibli Gazette Staff"}
            </span>
            <span>
              {dateStr} · {rt} min read
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
