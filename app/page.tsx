import Link from "next/link"
import Navbar from "@/components/Navbar"
import BlogGrid from "@/components/BlogGrid"
import LandscapeFeed from "@/components/LandscapeFeed"
import Footer from "@/components/Footer"
import ImageWithFallback from "@/components/ImageWithFallback"
import MascotButton from "@/components/MascotButton"
import TodayInHistory from "@/components/TodayInHistory"
import BreakingTicker from "@/components/BreakingTicker"
import AutoRefreshNews from "@/components/AutoRefreshNews"
import { getAllPosts, seedIfEmpty } from "@/lib/posts"
import { categoryLabel, getPostCoverImage, categoryGradient } from "@/lib/types"

export const revalidate = 300

function readTime(content: string): number {
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

export default async function HomePage() {
  await seedIfEmpty()
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((p) => p.published)
  const featured = posts.find((p) => p.featured) || posts[0]
  const sideStack = posts.filter((p) => p.id !== featured?.id).slice(0, 3)
  const tickerItems = posts.slice(0, 25).map((p) => p.title)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Ghibli Gazette",
    url: "https://ghibli-gazette.vercel.app",
    logo: "https://ghibli-gazette.vercel.app/favicon.ico",
    description: "Your anime & manga news hub: breaking anime news, manga updates, reviews, new releases, seasonal premieres, and industry intel — updated daily."
  }

  return (
    <main
      id="main-content"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <AutoRefreshNews />

      {/* Breaking News Ticker */}
      <BreakingTicker items={tickerItems} />

      {/* Hero Section: Magazine Editorial Grid */}
      {featured && (
        <section
          style={{
            background: "var(--bg2)",
            borderBottom: "1px solid var(--border)",
            padding: "32px 0 40px"
          }}
          aria-label="Featured Story"
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
                <article className="card" style={{ height: "420px", display: "flex", flexDirection: "column" }}>
                  {/* Top Section - Category Gradient Background */}
                  <div
                    style={{
                      height: "260px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "20px",
                      overflow: "hidden",
                      background: getCategoryGradient(featured.category),
                      borderRadius: "6px 6px 0 0"
                    }}
                  >
                    <ImageWithFallback
                      src={getPostCoverImage(featured)}
                      alt={featured.title}
                      className="card-image-hover"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.4
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.1) 100%)"
                      }}
                    />

                    <div style={{ position: "relative", zIndex: 2 }}>
                      <span
                        className="badge"
                        style={{
                          marginBottom: "14px",
                          display: "inline-flex",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          background: getCategoryColor(featured.category)
                        }}
                      >
                        {categoryLabel(featured.category).toUpperCase()}
                      </span>
                      <h1
                        className="font-playfair"
                        style={{
                          fontSize: "28px",
                          fontWeight: 400,
                          fontStyle: "italic",
                          color: "#fff",
                          lineHeight: 1.2,
                          marginBottom: "0",
                          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                          maxHeight: "67px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {featured.title}
                      </h1>
                    </div>
                  </div>

                  {/* Bottom Section - Content */}
                  <div style={{ background: "var(--card)", padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {featured.excerpt && (
                      <p
                        className="line-clamp-2"
                        style={{
                          fontFamily: "var(--font-inter, system-ui, sans-serif)",
                          fontSize: "13px",
                          color: "var(--text2)",
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
                        fontSize: "11px",
                        color: "var(--text3)",
                        fontFamily: "var(--font-inter, system-ui, sans-serif)",
                        marginBottom: "16px"
                      }}
                    >
                      <span>
                        {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
                          new Date(featured.date)
                        )}
                      </span>
                      <span>·</span>
                      <span>{readTime(featured.content)} min read</span>
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                          fontSize: "13px",
                          letterSpacing: "0.08em",
                          color: "var(--red)",
                          textDecoration: "none",
                          transition: "text-decoration 0.15s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                      >
                        Read Article →
                      </span>
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
                      <article
                        className="card"
                        style={{
                          display: "flex",
                          height: "100%",
                          minHeight: "130px",
                          padding: "0",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.borderColor = "var(--red)" }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card)"; e.currentTarget.style.borderColor = "var(--border)" }}
                      >
                        <div
                          style={{
                            width: "90px",
                            minWidth: "90px",
                            borderRadius: "6px 0 0 6px",
                            flexShrink: 0,
                            overflow: "hidden",
                            position: "relative",
                            background: getCategoryGradient(post.category)
                          }}
                        >
                          <ImageWithFallback
                            src={getPostCoverImage(post)}
                            alt={post.title}
                            className="card-image-hover"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: 0.6
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, padding: "12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <span
                            className="badge"
                            style={{
                              marginBottom: "6px",
                              alignSelf: "flex-start",
                              fontSize: "10px",
                              padding: "2px 8px",
                              background: getCategoryColor(post.category)
                            }}
                          >
                            {categoryLabel(post.category).toUpperCase()}
                          </span>
                          <p
                            className="line-clamp-2"
                            style={{
                              fontFamily: "var(--font-inter, system-ui, sans-serif)",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "var(--text)",
                              lineHeight: 1.35,
                              margin: 0,
                              transition: "color 0.15s ease"
                            }}
                          >
                            {post.title}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "var(--text3)",
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

      {/* Horizontal Landscape Spotlight Carousel */}
      <LandscapeFeed posts={posts} />

      {/* Main Stories Grid + Sidebar */}
      <BlogGrid posts={posts} sidebarExtra={<TodayInHistory />} />

      <Footer />

      <MascotButton />

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