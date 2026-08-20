import { NextRequest, NextResponse } from "next/server"
import { getAllPosts } from "@/lib/posts"

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY
const MEILISEARCH_INDEX = "posts"

async function searchMeilisearch(query: string, filters?: string) {
  if (!MEILISEARCH_HOST || !MEILISEARCH_API_KEY) {
    return null
  }

  try {
    const response = await fetch(`${MEILISEARCH_HOST}/indexes/${MEILISEARCH_INDEX}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEILISEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        q: query,
        filter: filters,
        limit: 20,
        attributesToHighlight: ["title", "excerpt"],
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
      }),
    })

    if (!response.ok) {
      throw new Error(`Meilisearch error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Meilisearch error:", error)
    return null
  }
}

function searchLocal(posts: Awaited<ReturnType<typeof getAllPosts>>, query: string, category?: string) {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  return posts
    .filter((post) => {
      if (!post.published) return false
      if (category && post.category !== category) return false

      const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(" ")}`.toLowerCase()
      return searchableText.includes(lowerQuery)
    })
    .slice(0, 20)
    .map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: post.date,
      coverImage: post.coverImage,
      _formatted: {
        title: post.title,
        excerpt: post.excerpt,
      },
    }))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || undefined
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10

  if (!query.trim()) {
    return NextResponse.json({ hits: [], totalHits: 0, page, totalPages: 0 })
  }

  const meiliResult = await searchMeilisearch(query, category ? `category = ${category}` : undefined)

  if (meiliResult) {
    const totalPages = Math.ceil(meiliResult.estimatedTotalHits / limit)
    return NextResponse.json({
      hits: meiliResult.hits,
      totalHits: meiliResult.estimatedTotalHits,
      page,
      totalPages,
      query: meiliResult.query,
      processingTimeMs: meiliResult.processingTimeMs,
    })
  }

  // Fallback to local search
  const posts = await getAllPosts()
  const results = searchLocal(posts, query, category)
  const totalPages = Math.ceil(results.length / limit)
  const paginated = results.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    hits: paginated,
    totalHits: results.length,
    page,
    totalPages,
    fallback: true,
  })
}