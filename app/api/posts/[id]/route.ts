import { NextRequest, NextResponse } from "next/server"
import { deletePost, getPostBySlug, updatePost } from "@/lib/posts"
import type { Post } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = (await request.json()) as Partial<Post>
  const updated = await updatePost(params.id, {
    ...data,
    excerpt: data.excerpt ? data.excerpt.slice(0, 150) : data.excerpt
  })

  if (!updated) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json(updated)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const post = await getPostBySlug(params.id)
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  await deletePost(params.id)
  return NextResponse.json({ success: true })
}
