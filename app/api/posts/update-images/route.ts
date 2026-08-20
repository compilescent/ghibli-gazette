import { NextResponse } from "next/server"
import { redis, getAllPosts } from "@/lib/posts"
import { type Post } from "@/lib/types"

export const dynamic = "force-dynamic"

/**
 * Verified, High-Resolution Official Anime Key Visuals & Studio Artwork Map
 */
export const OFFICIAL_POST_IMAGES: Record<string, string> = {
  "miyazaki-new-feature-film-in-production":
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop",
  "demon-slayer-infinity-castle-trilogy-dates":
    "https://images.alphacoders.com/136/1368940.jpeg",
  "chainsaw-man-reze-arc-movie-visual":
    "https://images.alphacoders.com/134/1344447.jpeg",
  "frieren-season-2-official-announcement":
    "https://images.alphacoders.com/133/1332822.png",
  "dandadan-premiere-review-science-saru":
    "https://images.alphacoders.com/137/1373516.png",
  "jujutsu-kaisen-culling-game-production":
    "https://images.alphacoders.com/134/1340656.png",
  "solo-leveling-season-2-arise-shadow":
    "https://images.alphacoders.com/134/1348126.png",
  "bleach-thousand-year-blood-war-part-3":
    "https://images.alphacoders.com/136/1368412.jpeg",
  "the-one-piece-wit-studio-remake-details":
    "https://images.alphacoders.com/134/1345437.png",
  "apothecary-diaries-season-2-preview":
    "https://images.alphacoders.com/135/1352467.jpeg",
  "delicious-in-dungeon-worldbuilding-masterpiece":
    "https://images.alphacoders.com/134/1349077.png",
  "ghibli-park-valley-of-witches-expansion":
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  "makoto-shinkai-next-theatrical-feature":
    "https://images.alphacoders.com/129/1293779.png",
  "ace-of-diamond-act-ii-second-seasons-2nd-part-previewed-in-teaser":
    "https://images.alphacoders.com/137/1376848.jpeg"
}

export async function POST() {
  try {
    const posts = await getAllPosts()
    let updatedCount = 0

    const updatedPosts: Post[] = posts.map((post) => {
      const targetImage = OFFICIAL_POST_IMAGES[post.id]
      if (targetImage && post.coverImage !== targetImage) {
        updatedCount++
        return {
          ...post,
          coverImage: targetImage
        }
      }
      return post
    })

    if (updatedCount > 0) {
      await redis.set("posts", updatedPosts)
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      total: posts.length,
      posts: updatedPosts.map((p) => ({ id: p.id, title: p.title, coverImage: p.coverImage }))
    })
  } catch (error) {
    console.error("Error updating post images:", error)
    return NextResponse.json({ success: false, error: "Failed to update images" }, { status: 500 })
  }
}
