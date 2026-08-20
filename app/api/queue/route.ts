import { NextRequest, NextResponse } from "next/server"
import { getQueuedStories } from "@/lib/newsQueue"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let stories = await getQueuedStories()
    if (status) {
      stories = stories.filter((s) => s.status === status)
    }

    return NextResponse.json(stories)
  } catch (error) {
    console.error("Error in GET /api/queue:", error)
    return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 })
  }
}
