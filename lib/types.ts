import { resolveAccurateCoverImage } from "./imageDatabase"

export type Category =
  | "anime-news"
  | "manga-news"
  | "review"
  | "new-release"
  | "premiere"
  | "industry"
  | "general"
  | "ghibli-news"

export interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  category: Category
  coverColor: string
  coverImage?: string
  author: string
  date: string
  published: boolean
  featured?: boolean
  tags: string[]
  views: number
}

export interface QueuedStory {
  id: string
  title: string
  originalTitle: string
  excerpt: string
  content: string
  category: Category
  coverImage: string
  coverColor: string
  sourceName: string
  sourceUrl: string
  sourceDate: string
  confidenceScore: number
  status: "pending" | "approved" | "dismissed"
  tags: string[]
  createdAt: string
  aiGenerated: boolean
}

export interface SiteSettings {
  siteName: string
  tagline: string
  instagram: string
  discord: string
  twitter: string
}

export const categories: { id: Category; label: string; from: string; to: string; color: string }[] = [
  { id: "anime-news", label: "Anime News", from: "#1a100a", to: "#4a2a0f", color: "#FF6B35" },
  { id: "manga-news", label: "Manga News", from: "#150a1a", to: "#3a0f4a", color: "#9B59B6" },
  { id: "review", label: "Reviews", from: "#0a1a0f", to: "#0f3d1f", color: "#2ECC71" },
  { id: "new-release", label: "New Releases", from: "#1a0a0a", to: "#4a0f0f", color: "#E8392A" },
  { id: "premiere", label: "Premieres", from: "#1a0a1a", to: "#4a0f4a", color: "#C94FAE" },
  { id: "industry", label: "Industry Intel", from: "#0a1a18", to: "#0f3a35", color: "#1ABC9C" },
  { id: "general", label: "General", from: "#0a0f1a", to: "#0f204a", color: "#4A8FE8" },
  { id: "ghibli-news", label: "Studio Ghibli", from: "#1a1535", to: "#2d1b69", color: "#667eea" }
]

export function categoryLabel(category?: string | Category | null): string {
  return categories.find((item) => item.id === category)?.label ?? "General"
}

export function categoryColor(category?: string | Category | null): string {
  const map: Record<string, string> = {
    "anime-news": "#FF6B35",
    "manga-news": "#9B59B6",
    "review": "#2ECC71",
    "new-release": "#E8392A",
    "premiere": "#C94FAE",
    "industry": "#1ABC9C",
    "general": "#4A8FE8",
    "ghibli-news": "#667eea"
  }
  return (category && map[category]) || "#667eea"
}

export function categoryGradient(category: Category): string {
  const found = categories.find((item) => item.id === category)
  return `linear-gradient(135deg, ${found?.from ?? "#667eea"}, ${found?.to ?? "#764ba2"})`
}

export function isCategory(value: string | null | undefined): value is Category {
  return [
    "anime-news",
    "manga-news",
    "review",
    "new-release",
    "premiere",
    "industry",
    "general",
    "ghibli-news"
  ].includes(value ?? "")
}

export function getPostCoverImage(post: { title?: string; category?: string; coverImage?: string; excerpt?: string }): string {
  const resolved = resolveAccurateCoverImage(post)
  return resolved.url
}