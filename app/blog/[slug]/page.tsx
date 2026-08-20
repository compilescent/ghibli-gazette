import Link from "next/link"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PostCard from "@/components/PostCard"
import ShareButtons from "@/components/ShareButtons"
import { getAllPosts, getPostBySlug, seedIfEmpty, updatePost } from "@/lib/posts"
import { categoryLabel, getPostCoverImage } from "@/lib/types"

export const dynamic = "force-dynamic"

function readTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await seedIfEmpty()
  const post = await getPostBySlug(params.slug)
  if (!post || !post.published) notFound()

  await updatePost(post.id, { views: (post.views || 0) + 1 })
  const allPosts = await getAllPosts()
  const others = allPosts.filter((p) => p.published && p.id !== post.id)
  const related = others.filter((p) => p.category === post.category).slice(0, 3)
  const morePosts = related.length > 0 ? related : others.slice(0, 3)

  const rt = readTime(post.content)
  const dateStr = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(post.date)
  )
  const authorName = post.author?.trim() || "Ghibli Gazette Staff"
  const imageUrl = getPostCoverImage(post)

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Article Hero Banner with Real Cover Image */}
      <section
        style={{
          width: "100%",
          height: "400px",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--bg-elevated)"
        }}
      >
        <img
          src={imageUrl}
          alt={post.title}
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
              "linear-gradient(to bottom, rgba(10, 10, 15, 0.3) 0%, rgba(10, 10, 15, 0.75) 65%, rgba(10, 10, 15, 0.98) 100%)"
          }}
        />

        <div
          className="shell"
          style={{
            position: "relative",
            zIndex: 2,
            paddingBottom: "36px",
            width: "100%"
          }}
        >
          {/* Breadcrumbs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "rgba(240, 238, 232, 0.65)",
              marginBottom: "16px",
              fontFamily: "var(--font-inter, system-ui, sans-serif)"
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
            <span>›</span>
            <Link href={`/category/${post.category}`} style={{ textDecoration: "none", color: "var(--accent)" }}>
              {categoryLabel(post.category)}
            </Link>
            <span>›</span>
            <span style={{ color: "rgba(240, 238, 232, 0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
              {post.title}
            </span>
          </div>

          <span className="badge" style={{ marginBottom: "14px", display: "inline-flex", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {categoryLabel(post.category)}
          </span>

          <h1
            style={{
              fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
              fontSize: "clamp(26px, 4vw, 42px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              maxWidth: "860px",
              margin: 0
            }}
          >
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Body Section */}
      <section style={{ padding: "40px 0 80px", flex: 1 }}>
        <div className="shell">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Meta Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 0",
                borderBottom: "1px solid var(--border)",
                marginBottom: "32px",
                fontSize: "13px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-inter, system-ui, sans-serif)"
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "6px",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "16px",
                  color: "#fff",
                  flexShrink: 0
                }}
              >
                GG
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>{authorName}</span>
                <span>·</span>
                <time dateTime={post.date} style={{ color: "var(--text-secondary)" }}>
                  {dateStr}
                </time>
                <span>·</span>
                <span>{rt} min read</span>
                {post.views > 0 && (
                  <>
                    <span>·</span>
                    <span>{post.views} views</span>
                  </>
                )}
              </div>
            </div>

            {/* Excerpt Pullquote */}
            {post.excerpt && (
              <blockquote
                style={{
                  borderLeft: "3px solid var(--accent)",
                  paddingLeft: "20px",
                  marginBottom: "36px",
                  fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                  fontSize: "18px",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6
                }}
              >
                {post.excerpt}
              </blockquote>
            )}

            {/* Article Content */}
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: "36px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "4px",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text-secondary)"
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <ShareButtons title={post.title} />

            {/* Back Button */}
            <div style={{ marginTop: "40px" }}>
              <Link href="/" className="btn btn-outline" style={{ display: "inline-flex" }}>
                ← Back to all stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {morePosts.length > 0 && (
        <section
          style={{
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border)",
            padding: "50px 0"
          }}
        >
          <div className="shell">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "16px",
                  letterSpacing: "0.2em",
                  color: "var(--text-muted)",
                  margin: 0
                }}
              >
                MORE LIKE THIS
              </h2>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "24px"
              }}
            >
              {morePosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
