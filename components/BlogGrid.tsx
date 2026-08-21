"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import PostCard from "./PostCard"
import { categories, categoryLabel, type Category } from "@/lib/types"
import type { Post } from "@/lib/types"
import { Button, Input } from "@/components/ui"
import ImageWithFallback from "./ImageWithFallback"

const POSTS_PER_PAGE = 6

type SortMode = "newest" | "oldest" | "views"

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

export default function BlogGrid({ posts, sidebarExtra }: { posts: Post[]; sidebarExtra?: React.ReactNode }) {
  const [active, setActive] = useState<Category | "all">("all")
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortMode>("newest")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const filtered = useMemo(() => {
    const base = active === "all" ? posts : posts.filter((p) => p.category === active)
    if (sort === "oldest") return [...base].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (sort === "views") return [...base].sort((a, b) => (b.views || 0) - (a.views || 0))
    return base
  }, [active, posts, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  const trending = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
  const ghibliPosts = posts.filter((p) => p.category === "ghibli-news").slice(0, 3)

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of posts) {
      counts[p.category] = (counts[p.category] ?? 0) + 1
    }
    return counts
  }, [posts])

  function setFilter(cat: Category | "all") {
    setActive(cat)
    setPage(1)
  }

  function handleSortChange(next: SortMode) {
    setSort(next)
    setPage(1)
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || subscribeStatus === "loading") return

    setSubscribeStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setSubscribeStatus("success")
      setEmail("")
      setTimeout(() => setSubscribeStatus("idle"), 5000)
    } catch (error) {
      setSubscribeStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
      setTimeout(() => setSubscribeStatus("idle"), 5000)
    }
  }

  const filterCategories = [
    { id: "all", label: "ALL" },
    { id: "anime-news", label: "ANIME NEWS" },
    { id: "manga-news", label: "MANGA" },
    { id: "review", label: "REVIEWS" },
    { id: "new-release", label: "RELEASES" },
    { id: "premiere", label: "PREMIERES" },
    { id: "ghibli-news", label: "GHIBLI" },
    { id: "general", label: "GENERAL" }
  ]

  return (
    <section id="latest-stories-section" style={{ padding: "0 0 60px" }}>
      {/* Category Filter Bar (Sticky) */}
      <div
        style={{
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "56px",
          zIndex: 40,
          backdropFilter: "blur(8px)",
          padding: "10px 0"
        }}
      >
        <div className="shell" style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div style={{ display: "flex", gap: "8px", padding: "0", minWidth: "max-content" }}>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as Category | "all")}
                className={`filter-pill ${active === cat.id ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area: 70% Posts + 30% Sidebar */}
      <div className="shell" style={{ paddingTop: "40px" }}>
        <div style={{ display: "grid", gap: "40px" }} className="magazine-layout">
          {/* Main Column */}
          <div>
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="section-label">LATEST STORIES</span>
                <div style={{ width: "3px", height: "22px", background: "var(--red)" }} />
                <h2 className="section-title" style={{ borderLeft: "none", paddingLeft: "0", marginBottom: "0" }}>
                  {active === "all" ? "ALL STORIES" : categoryLabel(active).toUpperCase()}
                </h2>
              </div>

              <div style={{ flex: 1, height: "1px", background: "var(--border)", minWidth: "40px" }} />

              {/* Sort Control */}
              <div style={{ display: "flex", gap: "4px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "999px", padding: "3px" }}>
                {([
                  ["newest", "Newest"],
                  ["oldest", "Oldest"],
                  ["views", "Most Read"]
                ] as [SortMode, string][]).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => handleSortChange(mode)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      background: sort === mode ? "var(--red)" : "transparent",
                      color: sort === mode ? "#fff" : "var(--text3)",
                      transition: "all 0.15s ease",
                      fontFamily: "var(--font-inter, system-ui, sans-serif)"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {paginated.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "var(--text3)",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px"
                }}
              >
                <p style={{ fontSize: "14px", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
                  No stories found in this category yet.
                </p>
              </div>
            ) : (
              <div
                id="latest-stories"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px"
                }}
              >
                {paginated.map((post, index) => (
                  <div key={post.id} style={{ animationDelay: `${index * 60}ms` }} className="reveal">
                    <PostCard key={post.id} post={post} />
                  </div>
                ))}
              </div>
            )}

            {/* Numbered Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "48px"
                }}
              >
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--border2)",
                    background: "var(--card)",
                    color: page === 1 ? "var(--text3)" : "var(--text)",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    opacity: page === 1 ? 0.5 : 1,
                    transition: "all 0.15s ease"
                  }}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
                      border: page === i + 1 ? "1px solid var(--red)" : "1px solid var(--border2)",
                      background: page === i + 1 ? "var(--red)" : "var(--card)",
                      color: page === i + 1 ? "#fff" : "var(--text2)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      transition: "all 0.15s ease"
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--border2)",
                    background: "var(--card)",
                    color: page === totalPages ? "var(--text3)" : "var(--text)",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    opacity: page === totalPages ? 0.5 : 1,
                    transition: "all 0.15s ease"
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Widget 1: TRENDING NOW */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "16px"
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "10px",
                  marginBottom: "10px"
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                    fontSize: "16px",
                    letterSpacing: "0.1em",
                    color: "var(--text)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>🔥</span> TRENDING
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {trending.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    style={{
                      textDecoration: "none",
                      padding: "10px 0",
                      borderBottom: i < trending.length - 1 ? "1px solid var(--border)" : "none",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.margin = "0 -16px"; e.currentTarget.style.padding = "10px 16px"; e.currentTarget.style.borderRadius = "6px" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.margin = "0"; e.currentTarget.style.padding = "10px 0"; e.currentTarget.style.borderRadius = "0" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                        fontSize: "28px",
                        color: "var(--border)",
                        minWidth: "36px",
                        lineHeight: 1,
                        transition: "color 0.15s ease"
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="line-clamp-2"
                        style={{
                          fontFamily: "var(--font-inter, system-ui, sans-serif)",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--text2)",
                          lineHeight: 1.4,
                          margin: 0,
                          transition: "color 0.15s ease"
                        }}
                      >
                        {post.title}
                      </p>
                      <span
                        style={{
                          fontSize: "10px",
                          color: getCategoryColor(post.category),
                          fontWeight: 600,
                          marginTop: "4px",
                          display: "inline-block",
                          background: getCategoryColor(post.category) + "20",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase"
                        }}
                      >
                        {categoryLabel(post.category)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 2: BROWSE CATEGORIES */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "16px"
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "16px",
                  letterSpacing: "0.1em",
                  color: "var(--text)",
                  marginBottom: "12px"
                }}
              >
                BROWSE CATEGORIES
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "var(--text2)",
                      fontSize: "12px",
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                      textAlign: "left",
                      width: "100%",
                      textDecoration: "none"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.borderColor = "transparent" }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: getCategoryColor(cat.id)
                        }}
                      />
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                        fontSize: "14px",
                        color: "var(--red)"
                      }}
                    >
                      {catCounts[cat.id] ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 3: STUDIO GHIBLI */}
            {ghibliPosts.length > 0 && (
              <div
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "16px"
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                    fontSize: "16px",
                    letterSpacing: "0.1em",
                    color: "var(--text)",
                    marginBottom: "12px"
                  }}
                >
                  STUDIO GHIBLI
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {ghibliPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.margin = "0 -16px"; e.currentTarget.style.padding = "0 16px"; e.currentTarget.style.borderRadius = "6px" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.margin = "0"; e.currentTarget.style.padding = "0"; e.currentTarget.style.borderRadius = "0" }}
                    >
                      <div
                        className="cat-ghibli-news"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "4px",
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          className="line-clamp-2"
                          style={{
                            fontFamily: "var(--font-inter, system-ui, sans-serif)",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--text)",
                            lineHeight: 1.4,
                            margin: 0,
                            transition: "color 0.15s ease"
                          }}
                        >
                          {post.title}
                        </p>
                        <span style={{ fontSize: "11px", color: "var(--text3)", marginTop: "4px", display: "block" }}>
                          {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(post.date))}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Widget: Today in Anime History (server-rendered) */}
            {sidebarExtra}

            {/* Widget 4: NEWSLETTER */}
            <div
              style={{
                background: "var(--red)",
                border: "none",
                borderRadius: "6px",
                padding: "20px",
                color: "#fff"
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "16px",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  marginBottom: "8px"
                }}
              >
                NEWSLETTER
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: "16px" }}>
                Get top anime and manga stories delivered straight to your inbox, every morning at 6 AM.
              </p>
              {subscribeStatus === "success" ? (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600
                  }}
                >
                  ✓ Subscribed! Check your email to confirm.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={subscribeStatus === "loading"}
                    className="input"
                    style={{
                      background: "#fff",
                      color: "var(--bg)",
                      fontSize: "13px",
                      borderRadius: "4px"
                    }}
                  />
                  {errorMessage && (
                    <p style={{ color: "var(--gold)", fontSize: "12px", margin: 0 }}>{errorMessage}</p>
                  )}
                  <Button type="submit" variant="primary" fullWidth disabled={subscribeStatus === "loading"} loading={subscribeStatus === "loading"} style={{ borderRadius: "4px" }}>
                    {subscribeStatus === "loading" ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .magazine-layout {
            grid-template-columns: 1fr 320px !important;
          }
        }
      `}</style>
    </section>
  )
}