import { NextRequest, NextResponse } from "next/server"
import { createPost, getAllPosts, isCategory, seedIfEmpty, slugify } from "@/lib/posts"
import type { Post } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  await seedIfEmpty()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const published = searchParams.get("published")

  let posts = await getAllPosts()
  if (isCategory(category)) posts = posts.filter((post) => post.category === category)
  if (published === "true") posts = posts.filter((post) => post.published)
  if (published === "false") posts = posts.filter((post) => !post.published)

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Post>
  const posts = await getAllPosts()
  const baseId = slugify(body.title ?? "untitled-story")
  const id = posts.some((post) => post.id === baseId) ? `${baseId}-${Date.now()}` : baseId
  const requestedCategory = body.category
  const category: Post["category"] = isCategory(requestedCategory) ? requestedCategory : "general"

  const created: Post = {
    id,
    title: body.title?.trim() || "Untitled Story",
    excerpt: (body.excerpt ?? "").slice(0, 150),
    content: body.content ?? "<p>A new story is being written.</p>",
    category,
    coverColor: body.coverColor ?? "#F4A261",
    author: body.author?.trim() || "Ghibli Gazette Staff",
    date: body.date ?? new Date().toISOString(),
    published: body.published ?? false,
    tags: Array.isArray(body.tags) ? body.tags : [],
    views: body.views ?? 0
  }

  await createPost(created)
  return NextResponse.json(created, { status: 201 })
}
