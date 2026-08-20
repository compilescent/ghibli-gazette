import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ghibli-gazette.vercel.app"
  const posts = await getAllPosts()
  const publishedPosts = posts.filter((p) => p.published)

  const postUrls = publishedPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: post.featured ? 1 : 0.7,
  }))

  const categoryUrls = [
    "ghibli-news",
    "review",
    "new-release",
    "premiere",
    "general",
  ].map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...postUrls,
  ]
}