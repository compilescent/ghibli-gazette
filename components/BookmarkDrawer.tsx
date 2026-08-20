"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { type Post, categoryLabel } from "@/lib/types"

export interface BookmarkItem {
  id: string
  title: string
  category: string
  coverImage?: string
  date: string
}

const STORAGE_KEY = "gg_saved_bookmarks"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setBookmarks(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Failed to load bookmarks:", e)
    }
  }, [])

  const isBookmarked = (id: string) => bookmarks.some((b) => b.id === id)

  const toggleBookmark = (item: BookmarkItem) => {
    let updated: BookmarkItem[]
    if (isBookmarked(item.id)) {
      updated = bookmarks.filter((b) => b.id !== item.id)
    } else {
      updated = [item, ...bookmarks]
    }
    setBookmarks(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error("Failed to save bookmark:", e)
    }
  }

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id)
    setBookmarks(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error("Failed to remove bookmark:", e)
    }
  }

  const clearAll = () => {
    setBookmarks([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Failed to clear bookmarks:", e)
    }
  }

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearAll }
}

interface BookmarkDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookmarkDrawer({ isOpen, onClose }: BookmarkDrawerProps) {
  const { bookmarks, removeBookmark, clearAll } = useBookmarks()

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease"
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Saved Stories"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          height: "100%",
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-12px 0 36px rgba(0, 0, 0, 0.8)",
          display: "flex",
          flexDirection: "column",
          animation: "slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-card)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>🔖</span>
            <h2
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "20px",
                letterSpacing: "0.08em",
                color: "var(--text-primary)",
                margin: 0
              }}
            >
              SAVED STORIES ({bookmarks.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "18px",
              cursor: "pointer",
              padding: "4px"
            }}
            aria-label="Close saved stories"
          >
            ✕
          </button>
        </div>

        {/* Bookmarks List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <span style={{ fontSize: "36px", display: "block", marginBottom: "12px", opacity: 0.5 }}>📖</span>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                No saved stories yet
              </p>
              <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
                Click the 🔖 bookmark button on any article card to save stories for quick offline reading.
              </p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  position: "relative"
                }}
              >
                {b.coverImage && (
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      background: "var(--bg-elevated)",
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={b.coverImage}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                      letterSpacing: "0.1em",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      background: "var(--accent)",
                      color: "#fff",
                      textTransform: "uppercase"
                    }}
                  >
                    {categoryLabel(b.category)}
                  </span>
                  <Link
                    href={`/blog/${b.id}`}
                    onClick={onClose}
                    style={{
                      display: "block",
                      marginTop: "4px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                      textDecoration: "none"
                    }}
                  >
                    <span className="line-clamp-2">{b.title}</span>
                  </Link>
                </div>
                <button
                  onClick={() => removeBookmark(b.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "13px",
                    alignSelf: "flex-start",
                    padding: "2px"
                  }}
                  title="Remove from saved"
                  aria-label={`Remove ${b.title} from saved`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarks.length > 0 && (
          <div
            style={{
              padding: "14px 20px",
              background: "var(--bg-card)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Stored locally on device
            </span>
            <button
              onClick={clearAll}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
