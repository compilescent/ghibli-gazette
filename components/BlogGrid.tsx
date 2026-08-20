"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import PostCard from "./PostCard"
import { categories, categoryLabel, type Category } from "@/lib/types"
import type { Post } from "@/lib/types"
import { Button, Input } from "@/components/ui"

const POSTS_PER_PAGE = 6

type SortMode = "newest" | "oldest" | "views"

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

  return (
    <section id="latest-stories-section" style={{ padding: "0 0 60px" }}>
      {/* Category Filter Bar (Sticky) */}
      <div
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "60px",
          zIndex: 35,
          backdropFilter: "blur(8px)"
        }}
      >
        <div className="shell" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", gap: "8px", padding: "12px 0", minWidth: "max-content" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "6px 16px",
                borderRadius: "4px",
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "14px",
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: active === "all" ? "1px solid var(--accent)" : "1px solid var(--border-light)",
                background: active === "all" ? "var(--accent)" : "transparent",
                color: active === "all" ? "#fff" : "var(--text-secondary)"
              }}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "4px",
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: active === cat.id ? "1px solid var(--accent)" : "1px solid var(--border-light)",
                  background: active === cat.id ? "var(--accent)" : "transparent",
                  color: active === cat.id ? "#fff" : "var(--text-secondary)"
                }}
              >
                {cat.label.toUpperCase()}
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
              <h2
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "14px",
                  letterSpacing: "0.2em",
                  color: "var(--text-muted)",
                  margin: 0
                }}
              >
                LATEST STORIES
              </h2>
              <div style={{ flex: 1, height: "1px", background: "var(--border)", minWidth: "40px" }} />

              {/* Sort Control */}
              <div style={{ display: "flex", gap: "4px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "999px", padding: "3px" }}>
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
                      background: sort === mode ? "var(--accent)" : "transparent",
                      color: sort === mode ? "#fff" : "var(--text-muted)",
                      transition: "all 0.15s ease",
                      fontFamily: "var(--font-inter, system-ui, sans-serif)"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {paginated.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "var(--text-muted)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px"
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
                  gap: "24px"
                }}
              >
                {paginated.map((post) => (
                  <PostCard key={post.id} post={post} />
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
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-card)",
                    color: page === 1 ? "var(--text-muted)" : "var(--text-primary)",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    opacity: page === 1 ? 0.5 : 1,
                    transition: "all 0.2s ease"
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
                      border: page === i + 1 ? "1px solid var(--accent)" : "1px solid var(--border-light)",
                      background: page === i + 1 ? "var(--accent)" : "var(--bg-card)",
                      color: page === i + 1 ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      transition: "all 0.2s ease"
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
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-card)",
                    color: page === totalPages ? "var(--text-muted)" : "var(--text-primary)",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    opacity: page === totalPages ? 0.5 : 1,
                    transition: "all 0.2s ease"
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Widget 1: TRENDING NOW */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "24px"
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  color: "var(--accent)",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>🔥</span> TRENDING
              </h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {trending.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="sidebar-trending-item"
                    style={{
                      borderBottom: i < trending.length - 1 ? "1px solid var(--border)" : "none"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                        fontSize: "26px",
                        color: "var(--text-muted)",
                        minWidth: "32px",
                        lineHeight: 1
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p
                        className="line-clamp-2 trending-title"
                        style={{
                          fontFamily: "var(--font-inter, system-ui, sans-serif)",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          lineHeight: 1.4,
                          transition: "color 0.2s ease"
                        }}
                      >
                        {post.title}
                      </p>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--accent)",
                          fontWeight: 600,
                          marginTop: "4px",
                          display: "inline-block"
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
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "24px"
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  color: "var(--text-primary)",
                  marginBottom: "16px"
                }}
              >
                BROWSE
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`sidebar-category-btn ${active === cat.id ? "active" : ""}`}
                  >
                    <span>{cat.label}</span>
                    <span
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        padding: "1px 8px",
                        fontSize: "11px",
                        color: "var(--text-muted)"
                      }}
                    >
                      {catCounts[cat.id] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 3: LATEST GHIBLI */}
            {ghibliPosts.length > 0 && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "24px"
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                    fontSize: "18px",
                    letterSpacing: "0.1em",
                    color: "var(--text-primary)",
                    marginBottom: "16px"
                  }}
                >
                  STUDIO GHIBLI
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {ghibliPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="sidebar-ghibli-item"
                    >
                      <div
                        className="cat-ghibli-news"
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "6px",
                          flexShrink: 0
                        }}
                      />
                      <div>
                        <p
                          className="line-clamp-2 ghibli-title"
                          style={{
                            fontFamily: "var(--font-inter, system-ui, sans-serif)",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            lineHeight: 1.4,
                            transition: "color 0.2s ease"
                          }}
                        >
                          {post.title}
                        </p>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
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
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "24px"
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  color: "var(--text-primary)",
                  marginBottom: "8px"
                }}
              >
                NEWSLETTER
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                Get top anime and manga stories delivered straight to your inbox, every morning at 6 AM.
              </p>
              {subscribeStatus === "success" ? (
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "10px 14px",
                    background: "rgba(45, 106, 79, 0.25)",
                    border: "1px solid var(--ghibli-green)",
                    borderRadius: "6px",
                    color: "#87CEEB",
                    fontSize: "13px",
                    fontWeight: 600
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${(i * 8.3) + 2}%`,
                        background: ["#E8643A", "#F0C040", "#87CEEB", "#2D9966"][i % 4],
                        animationDelay: `${i * 0.06}s`
                      }}
                    />
                  ))}
                  ✓ Subscribed! Check your email to confirm.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={subscribeStatus === "loading"}
                    style={{ fontSize: "13px" }}
                  />
                  {errorMessage && (
                    <p style={{ color: "#F07550", fontSize: "12px", margin: 0 }}>{errorMessage}</p>
                  )}
                  <Button type="submit" variant="primary" fullWidth disabled={subscribeStatus === "loading"} loading={subscribeStatus === "loading"}>
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
