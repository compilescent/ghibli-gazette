import { NextResponse } from "next/server"
import { getQueuedStories, saveQueue } from "@/lib/newsQueue"
import { resolveAccurateCoverImage, isValidArticleImageUrl, upgradeSourceImageUrl } from "@/lib/imageDatabase"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const queue = await getQueuedStories()
    let updatedCount = 0

    const updatedQueue = queue.map((story) => {
      // If cover image is invalid or generic, resolve authentic official image
      const resolved = resolveAccurateCoverImage({
        title: story.title,
        excerpt: story.excerpt,
        category: story.category,
        coverImage: isValidArticleImageUrl(story.coverImage) ? upgradeSourceImageUrl(story.coverImage) : undefined
      })

      if (story.coverImage !== resolved.url) {
        updatedCount++
        return {
          ...story,
          coverImage: resolved.url,
          confidenceScore: resolved.matchType === "franchise" ? 98 : resolved.matchType === "source" ? 99 : 95
        }
      }
      return story
    })

    if (updatedCount > 0) {
      await saveQueue(updatedQueue)
    }

    return NextResponse.json({ success: true, updatedCount, total: queue.length })
  } catch (error) {
    console.error("Error revalidating queue images:", error)
    return NextResponse.json({ success: false, error: "Failed to revalidate" }, { status: 500 })
  }
}
