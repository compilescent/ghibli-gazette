"use client"

import Link from "next/link"
import { useState } from "react"
import { categoryLabel, getPostCoverImage } from "@/lib/types"
import type { Post } from "@/lib/types"
import ImageWithFallback from "./ImageWithFallback"
import { useBookmarks } from "./BookmarkDrawer"
import { Card, Badge } from "@/components/ui"

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
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const saved = isBookmarked(post.id)
  const [burst, setBurst] = useState(false)

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark({
      id: post.id,
      title: post.title,
      category: post.category,
      coverImage: imageUrl,
      date: post.date
    })
    if (!saved) {
      setBurst(true)
      setTimeout(() => setBurst(false), 650)
    }
  }

  return (
    <Card variant="default" hover padding="none" className="flex flex-col h-full overflow-hidden">
      <Link href={`/blog/${post.id}`} className="block">
        {/* Top Real Image Panel (180px) */}
        <div
          className="relative aspect-video overflow-hidden bg-bg-elevated"
          style={{ flexShrink: 0 }}
        >
          <ImageWithFallback
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent" />

          <Badge className="absolute top-3 left-3 z-10 shadow-lg" variant="default">
            {categoryLabel(post.category)}
          </Badge>

          {/* 1-Click Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all backdrop-blur-sm border border-white/20"
            style={{
              background: saved ? "var(--accent)" : "rgba(10, 11, 16, 0.75)",
              color: "#fff",
            }}
            title={saved ? "Remove from saved" : "Save for later"}
            aria-label={saved ? "Remove bookmark" : "Add bookmark"}
          >
            {burst && <span className="sparkle-burst">✦</span>}
            {saved ? "★" : "🔖"}
          </button>

          {(featured || post.featured) && (
            <Badge className="absolute top-3 right-10 z-10 shadow-lg" variant="gold">
              ★ FEATURED
            </Badge>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display text-base font-bold text-text-primary line-clamp-2 group-hover:text-accent transition-colors mb-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="font-inter text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Footer Metadata */}
          <div className="mt-auto flex justify-between items-center text-xs text-text-muted pt-3 border-t border-border font-inter">
            <div className="flex items-center gap-2">
              <span>{dateStr}</span>
              {post.views !== undefined && post.views > 0 && (
                <>
                  <span>·</span>
                  <span>{post.views} views</span>
                </>
              )}
            </div>
            <span>{rt} min read</span>
          </div>
        </div>
      </Link>
    </Card>
  )
}