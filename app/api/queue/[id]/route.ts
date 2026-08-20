import { NextRequest, NextResponse } from "next/server"
import { dismissQueuedStory, updateQueuedStory } from "@/lib/newsQueue"
import { type QueuedStory } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dismissQueuedStory(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error dismissing queued story ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to dismiss story" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as Partial<QueuedStory>
    const updated = await updateQueuedStory(params.id, body)

    if (!updated) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, story: updated })
  } catch (error) {
    console.error(`Error updating queued story ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 })
  }
}
