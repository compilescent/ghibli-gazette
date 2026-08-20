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
  { id: "anime-news", label: "Anime News", from: "#667eea", to: "#764ba2", color: "#667eea" },
  { id: "manga-news", label: "Manga News", from: "#43b89c", to: "#2d8a7a", color: "#2D9966" },
  { id: "review", label: "Reviews", from: "#F4A261", to: "#E9C46A", color: "#E8643A" },
  { id: "new-release", label: "New Releases", from: "#f093fb", to: "#f5576c", color: "#C94FAE" },
  { id: "premiere", label: "Premieres", from: "#4facfe", to: "#00f2fe", color: "#4A90D9" },
  { id: "industry", label: "Industry Intel", from: "#9b5de5", to: "#f15bb5", color: "#9b5de5" },
  { id: "general", label: "General", from: "#43aa8b", to: "#90be6d", color: "#43aa8b" },
  { id: "ghibli-news", label: "Studio Ghibli", from: "#f72585", to: "#b5179e", color: "#f72585" }
]

export function categoryLabel(category?: string | Category | null): string {
  return categories.find((item) => item.id === category)?.label ?? "General"
}

export function categoryColor(category?: string | Category | null): string {
  const map: Record<string, string> = {
    "anime-news": "#667eea",
    "manga-news": "#2D9966",
    "review": "#E8643A",
    "new-release": "#C94FAE",
    "premiere": "#4A90D9",
    "industry": "#9b5de5",
    "general": "#43aa8b",
    "ghibli-news": "#f72585"
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