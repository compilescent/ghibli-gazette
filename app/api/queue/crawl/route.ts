import { NextResponse } from "next/server"
import { crawlAndQueueNews } from "@/lib/newsQueue"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const result = await crawlAndQueueNews()
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error running news crawl:", error)
    return NextResponse.json(
      { success: false, error: "Failed to run news aggregation crawl" },
      { status: 500 }
    )
  }
}
