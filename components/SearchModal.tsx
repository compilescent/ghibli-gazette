"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Post, categoryLabel } from "@/lib/types"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const QUICK_TAGS = [
  { label: "All", tag: "" },
  { label: "Jujutsu Kaisen", tag: "jjk" },
  { label: "Manga Panels", tag: "manga" },
  { label: "Studio Ghibli", tag: "ghibli" },
  { label: "Demon Slayer", tag: "demon-slayer" },
  { label: "Chainsaw Man", tag: "chainsaw-man" },
  { label: "One Piece", tag: "one-piece" },
  { label: "Solo Leveling", tag: "solo-leveling" }
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch posts once when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setActiveTag("")
      setSelectedIndex(0)
      if (posts.length === 0) {
        setLoading(true)
        fetch("/api/posts")
          .then((res) => res.json())
          .then((data: Post[]) => {
            if (Array.isArray(data)) {
              setPosts(data.filter((p) => p.published))
            }
          })
          .catch((err) => console.error("Failed to load search posts:", err))
          .finally(() => setLoading(false))
      }
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Filter posts based on query and tag
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const tag = activeTag.toLowerCase()

    return posts.filter((post) => {
      const matchTag =
        !tag ||
        post.tags?.some((t) => t.toLowerCase().includes(tag)) ||
        post.title.toLowerCase().includes(tag) ||
        post.category.toLowerCase().includes(tag)

      if (!matchTag) return false
      if (!q) return true

      const matchTitle = post.title.toLowerCase().includes(q)
      const matchExcerpt = post.excerpt?.toLowerCase().includes(q)
      const matchContent = post.content.toLowerCase().includes(q)
      const matchTags = post.tags?.some((t) => t.toLowerCase().includes(q))
      const matchCategory = post.category.toLowerCase().includes(q)

      return matchTitle || matchExcerpt || matchContent || matchTags || matchCategory
    })
  }, [posts, query, activeTag])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return

      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredPosts.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredPosts.length - 1))
      } else if (e.key === "Enter" && filteredPosts[selectedIndex]) {
        e.preventDefault()
        const target = filteredPosts[selectedIndex]
        onClose()
        router.push(`/blog/${target.id}`)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredPosts, selectedIndex, router, onClose])

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px 16px 20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
          animation: "slideDown 0.2s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            gap: "12px",
            background: "var(--bg-card)"
          }}
        >
          <span style={{ fontSize: "18px", color: "var(--accent)" }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search anime news, manga panels, Ghibli films, JJK, characters..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "15px",
              fontFamily: "var(--font-inter, system-ui, sans-serif)"
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "var(--bg-elevated)",
                border: "none",
                color: "var(--text-muted)",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                fontSize: "11px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>
          )}
          <span
            style={{
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontFamily: "monospace"
            }}
          >
            ESC
          </span>
        </div>

        {/* Quick Tag Pills */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-primary)",
            overflowX: "auto"
          }}
        >
          {QUICK_TAGS.map((item) => {
            const isSelected = activeTag === item.tag
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTag(isSelected ? "" : item.tag)
                  setSelectedIndex(0)
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: isSelected ? "var(--accent)" : "var(--bg-card)",
                  color: isSelected ? "#fff" : "var(--text-secondary)"
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Search Results list */}
        <div
          ref={listRef}
          style={{
            overflowY: "auto",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
              Searching stories...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "4px" }}>
                No stories found
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Try searching for "Jujutsu Kaisen", "Manga", "Ghibli", "Demon Slayer", or "Frieren"
              </p>
            </div>
          ) : (
            filteredPosts.map((post, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  onClick={onClose}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    background: isSelected ? "var(--bg-elevated)" : "transparent",
                    border: isSelected ? "1px solid var(--border-light)" : "1px solid transparent",
                    transition: "all 0.1s ease",
                    alignItems: "center"
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "54px",
                      height: "44px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      background: "var(--bg-card)",
                      flexShrink: 0,
                      position: "relative"
                    }}
                  >
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "var(--accent)",
                          opacity: 0.3
                        }}
                      />
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                          letterSpacing: "0.08em",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          background: "var(--accent)",
                          color: "#fff",
                          textTransform: "uppercase"
                        }}
                      >
                        {categoryLabel(post.category)}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
                          new Date(post.date)
                        )}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-baskerville, Georgia, serif)",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: isSelected ? "var(--accent)" : "var(--text-primary)",
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {post.title}
                    </p>
                  </div>

                  <span style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0 }}>
                    {isSelected ? "↵" : "→"}
                  </span>
                </Link>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: "10px 16px",
            background: "var(--bg-primary)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "var(--text-muted)"
          }}
        >
          <span>
            {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"}
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
