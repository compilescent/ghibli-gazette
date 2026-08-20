import { ImageResponse } from "next/og"
import { getPostBySlug } from "@/lib/posts"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)",
            fontFamily: "Georgia, serif",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: "#E8643A", marginBottom: 16 }}>
            GHIBLI GAZETTE
          </div>
          <div style={{ fontSize: 32, color: "#F0EEE8", textAlign: "center", padding: "0 40px" }}>
            Article not found
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const title = post.title.length > 80 ? post.title.slice(0, 80) + "…" : post.title

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0A0A0F 0%, #16213E 50%, #0F3460 100%)",
          fontFamily: "'Libre Baskerville', Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(232, 100, 58, 0.1)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(102, 126, 234, 0.1)",
            filter: "blur(100px)",
          }}
        />

        {/* Top brand */}
        <div style={{ padding: 40, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#E8643A", letterSpacing: "0.02em" }}>
            GHIBLI
          </span>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8643A" }} />
          <span style={{ fontSize: 36, fontWeight: 700, color: "#F0EEE8", letterSpacing: "0.02em" }}>
            GAZETTE
          </span>
        </div>

        {/* Category badge */}
        <div style={{ padding: "0 40px", marginBottom: 24 }}>
          <span
            style={{
              display: "inline-block",
              padding: "8px 20px",
              borderRadius: 9999,
              background: "rgba(232, 100, 58, 0.2)",
              color: "#E8643A",
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            {post.category.replace("-", " ").toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <div style={{ padding: "0 60px 40px", flex: 1, display: "flex", alignItems: "center" }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom meta */}
        <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#9896A8", fontSize: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200))} min read
            </span>
          </div>
          <div style={{ color: "#E8643A", fontSize: 18, fontWeight: 600 }}>
            ghibli-gazette.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}