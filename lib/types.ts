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

export function getPostCoverImage(post: { title?: string; category?: string; coverImage?: string }): string {
  if (post.coverImage && post.coverImage.trim().length > 0) {
    return post.coverImage
  }

  const title = (post.title || "").toLowerCase()

  if (title.includes("heron") || title.includes("boy and the heron") || title.includes("oscar")) {
    return "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
  }
  if (title.includes("totoro") || title.includes("neighbor")) {
    return "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"
  }
  if (title.includes("park") || title.includes("theme park") || title.includes("aichi") || title.includes("mononoke")) {
    return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop"
  }
  if (title.includes("miyazaki") || title.includes("ghibli") || title.includes("spirited") || title.includes("howl")) {
    return "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop"
  }
  if (title.includes("premiere") || title.includes("august") || title.includes("season") || title.includes("demon slayer") || title.includes("frieren") || title.includes("chainsaw")) {
    return "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
  }
  if (title.includes("one piece") || title.includes("jujutsu") || title.includes("dragon ball") || title.includes("bleach")) {
    return "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop"
  }

  switch (post.category) {
    case "ghibli-news":
      return "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop"
    case "new-release":
      return "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop"
    case "review":
      return "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"
    case "premiere":
      return "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
    default:
      return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop"
  }
}
