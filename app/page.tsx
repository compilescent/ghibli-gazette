import Link from "next/link"
import Navbar from "@/components/Navbar"
import BlogGrid from "@/components/BlogGrid"
import Footer from "@/components/Footer"
import { getAllPosts, seedIfEmpty } from "@/lib/posts"
import { categoryLabel, getPostCoverImage, type Post } from "@/lib/types"

export const dynamic = "force-dynamic"

function readTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function HomePage() {
  await seedIfEmpty()
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((p) => p.published)
  const featured = posts.find((p) => p.featured) || posts[0]
  const sideStack = posts.filter((p) => p.id !== featured?.id).slice(0, 3)
  const tickerText = posts.map((p) => p.title).join("   ✦   ")

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Breaking News Ticker */}
      {posts.length > 0 && (
        <section
          style={{
            background: "linear-gradient(90deg, #E8643A, #F07550, #C94FAE, #667eea, #E8643A)",
            backgroundSize: "300% 100%",
            animation: "gradientShift 12s ease infinite",
            height: "34px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
          }}
        >
          <div
            style={{
              flexShrink: 0,
              padding: "0 16px",
              background: "rgba(0, 0, 0, 0.3)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: "13px",
              letterSpacing: "0.15em",
              color: "#fff",
              whiteSpace: "nowrap"
            }}
          >
            <span style={{ fontSize: "14px" }}>⚡</span>
            <span>BREAKING</span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#fff",
                animation: "pulse-dot 1.5s ease-in-out infinite",
                display: "inline-block",
                marginLeft: "2px"
              }}
            />
          </div>
          <div className="ticker-wrap" style={{ flex: 1 }}>
            <div className="ticker-content">
              <span
                style={{
                  padding: "0 28px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "var(--font-inter, system-ui, sans-serif)",
                  letterSpacing: "0.02em"
                }}
              >
                {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section: 65% Featured + 35% Side Stack */}
      {featured && (
        <section
          style={{
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "32px 0 40px"
          }}
        >
          <div className="shell">
            <div
              style={{
                display: "grid",
                gap: "20px"
              }}
              className="hero-magazine-grid"
            >
              {/* Left Large Featured Card (65%) */}
              <Link
                href={`/blog/${featured.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <article className="hero-featured-card">
                  <div
                    style={{
                      height: "390px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "28px",
                      overflow: "hidden",
                      background: "var(--bg-elevated)"
                    }}
                  >
                    <img
                      src={getPostCoverImage(featured)}
                      alt={featured.title}
                      loading="lazy"
                      style={{
                        position: "absolute",
                        inset: 0,
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
                        background:
                          "linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.55) 50%, rgba(10, 10, 15, 0.15) 100%)"
                      }}
                    />

                    <div style={{ position: "relative", zIndex: 2 }}>
                      <span
                        className="badge"
                        style={{
                          marginBottom: "14px",
                          display: "inline-flex",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
                        }}
                      >
                        {categoryLabel(featured.category)}
                      </span>
                      <h1
                        className="card-title-hover"
                        style={{
                          fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                          fontSize: "clamp(22px, 3vw, 34px)",
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1.25,
                          marginBottom: "10px"
                        }}
                      >
                        {featured.title}
                      </h1>
                      {featured.excerpt && (
                        <p
                          className="line-clamp-2"
                          style={{
                            fontFamily: "var(--font-inter, system-ui, sans-serif)",
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.5,
                            marginBottom: "16px"
                          }}
                        >
                          {featured.excerpt}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-inter, system-ui, sans-serif)"
                        }}
                      >
                        <span>
                          {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
                            new Date(featured.date)
                          )}
                        </span>
                        <span>·</span>
                        <span>{readTime(featured.content)} min read</span>
                        <span
                          style={{
                            marginLeft: "auto",
                            color: "var(--accent)",
                            fontWeight: 700,
                            fontSize: "13px"
                          }}
                        >
                          Read Article →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Right Stack (3 Smaller Posts, 35%) */}
              {sideStack.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    justifyContent: "space-between"
                  }}
                >
                  {sideStack.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      style={{ textDecoration: "none", display: "block", flex: 1 }}
                    >
                      <article className="hero-side-card">
                        <div
                          style={{
                            width: "84px",
                            height: "84px",
                            borderRadius: "6px",
                            flexShrink: 0,
                            overflow: "hidden",
                            background: "var(--bg-elevated)",
                            position: "relative"
                          }}
                        >
                          <img
                            src={getPostCoverImage(post)}
                            alt={post.title}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease"
                            }}
                            className="card-image-hover"
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <span
                            className="badge"
                            style={{
                              marginBottom: "6px",
                              alignSelf: "flex-start",
                              fontSize: "10px",
                              padding: "2px 6px"
                            }}
                          >
                            {categoryLabel(post.category)}
                          </span>
                          <p
                            className="line-clamp-2 card-title-hover"
                            style={{
                              fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              lineHeight: 1.35,
                              margin: 0
                            }}
                          >
                            {post.title}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              marginTop: "6px",
                              fontFamily: "var(--font-inter, system-ui, sans-serif)",
                              margin: "6px 0 0 0"
                            }}
                          >
                            {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
                              new Date(post.date)
                            )}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Stories Grid + Sidebar */}
      <BlogGrid posts={posts} />

      <Footer />

      <style>{`
        @media (min-width: 860px) {
          .hero-magazine-grid {
            grid-template-columns: 65% 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
