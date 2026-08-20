import Link from "next/link"
import Navbar from "@/components/Navbar"
import BlogGrid from "@/components/BlogGrid"
import LandscapeFeed from "@/components/LandscapeFeed"
import ReleaseRadar from "@/components/ReleaseRadar"
import Footer from "@/components/Footer"
import ImageWithFallback from "@/components/ImageWithFallback"
import AnimatedCounter from "@/components/AnimatedCounter"
import MascotButton from "@/components/MascotButton"
import TodayInHistory from "@/components/TodayInHistory"
import BreakingTicker from "@/components/BreakingTicker"
import AutoRefreshNews from "@/components/AutoRefreshNews"
import { getAllPosts, seedIfEmpty } from "@/lib/posts"
import { categoryLabel, getPostCoverImage } from "@/lib/types"

export const revalidate = 300

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
  const tickerItems = posts.slice(0, 25).map((p) => p.title)

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalReadMinutes = posts.reduce(
    (sum, p) => sum + Math.max(1, Math.ceil(p.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200)),
    0
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Ghibli Gazette",
    url: "https://ghibli-gazette.vercel.app",
    logo: "https://ghibli-gazette.vercel.app/favicon.ico",
    description: "Your anime & manga news hub: breaking anime news, manga updates, reviews, new releases, seasonal premieres, and industry intel."
  }

  return (
    <main
      id="main-content"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <AutoRefreshNews />

      {/* Breaking News Ticker */}
      <BreakingTicker items={tickerItems} />

      {/* Hero Section: 65% Featured + 35% Side Stack */}
      {featured && (
        <section
          style={{
            background: "var(--bg-secondary)",
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
                <article className="hero-featured-card">
                  <div
                    style={{
                      height: "400px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "28px",
                      overflow: "hidden",
                      background: "var(--bg-elevated)",
                      borderRadius: "10px"
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
                        objectFit: "cover"
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(10, 11, 16, 0.95) 0%, rgba(10, 11, 16, 0.5) 50%, rgba(10, 11, 16, 0.1) 100%)"
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
                          fontSize: "clamp(22px, 3.2vw, 34px)",
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
                            width: "88px",
                            height: "88px",
                            borderRadius: "8px",
                            flexShrink: 0,
                            overflow: "hidden",
                            background: "var(--bg-elevated)",
                            position: "relative"
                          }}
                        >
                          <ImageWithFallback
                            src={getPostCoverImage(post)}
                            alt={post.title}
                            className="card-image-hover"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
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

      {/* Horizontal Landscape Spotlight Carousel */}
      <LandscapeFeed posts={posts} />

      {/* Anime Release Radar with Countdown Timers */}
      <ReleaseRadar />

      {/* Hub Stats Bar */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "28px 0" }}>
        <div className="shell">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px", textAlign: "center" }}>
            {[
              { value: posts.length, suffix: "", label: "Stories Published" },
              { value: totalViews, suffix: "+", label: "Total Views" },
              { value: totalReadMinutes, suffix: " min", label: "Of Reading Time" },
              { value: 8, suffix: "", label: "News Categories" }
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                    fontSize: "clamp(24px, 3.5vw, 34px)",
                    fontWeight: 700,
                    color: "var(--accent)",
                    margin: 0
                  }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p style={{ fontSize: "11.5px", letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", margin: "4px 0 0" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
