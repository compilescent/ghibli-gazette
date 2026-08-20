import { resolveAccurateCoverImage } from "./imageDatabase"

export type Category =
  | "ghibli-news"
  | "new-release"
  | "review"
  | "premiere"
  | "general"

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
  instagram: string
  discord: string
  twitter: string
}

export const categories: { id: Category; label: string; from: string; to: string; color: string }[] = [
  { id: "ghibli-news", label: "Ghibli News", from: "#667eea", to: "#764ba2", color: "#667eea" },
  { id: "new-release", label: "New Releases", from: "#F4A261", to: "#E9C46A", color: "#E8643A" },
  { id: "review", label: "Reviews", from: "#43b89c", to: "#2d8a7a", color: "#2D9966" },
  { id: "premiere", label: "Premieres", from: "#f093fb", to: "#f5576c", color: "#C94FAE" },
  { id: "general", label: "General", from: "#4facfe", to: "#00f2fe", color: "#4A90D9" }
]

export function categoryLabel(category?: string | Category | null): string {
  return categories.find((item) => item.id === category)?.label ?? "General"
}

export function categoryColor(category?: string | Category | null): string {
  const map: Record<string, string> = {
    "ghibli-news": "#667eea",
    "new-release": "#E8643A",
    "review": "#2D9966",
    "premiere": "#C94FAE",
    "general": "#4A90D9"
  }
  return (category && map[category]) || "#E8643A"
}

export function categoryGradient(category: Category): string {
  const found = categories.find((item) => item.id === category)
  return `linear-gradient(135deg, ${found?.from ?? "#4facfe"}, ${found?.to ?? "#00f2fe"})`
}

export function isCategory(value: string | null | undefined): value is Category {
  return ["ghibli-news", "new-release", "review", "premiere", "general"].includes(value ?? "")
}

export function getPostCoverImage(post: { title?: string; category?: string; coverImage?: string; excerpt?: string }): string {
  const resolved = resolveAccurateCoverImage(post)
  return resolved.url
}
