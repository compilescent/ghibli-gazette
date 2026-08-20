import { NextRequest, NextResponse } from "next/server"
import { approveAndPublishStory } from "@/lib/newsQueue"
import { type QueuedStory } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<QueuedStory>
    const publishedPost = await approveAndPublishStory(params.id, body)

    if (!publishedPost) {
      return NextResponse.json({ error: "Story not found in queue" }, { status: 404 })
    }

    return NextResponse.json({ success: true, post: publishedPost })
  } catch (error) {
    console.error(`Error approving story ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to publish story" }, { status: 500 })
  }
}
