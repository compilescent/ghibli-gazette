import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { crawlAndQueueNews, getLastCrawlTime } from "@/lib/newsQueue"

export const dynamic = "force-dynamic"

/** Minimum gap between crawls; page visits trigger the API, this prevents stampedes */
const CRAWL_INTERVAL_MS = 45 * 60 * 1000

export async function POST() {
  const lastCrawl = await getLastCrawlTime()
  if (lastCrawl && Date.now() - lastCrawl < CRAWL_INTERVAL_MS) {
    return NextResponse.json({ success: true, skipped: true })
  }

  try {
    const result = await crawlAndQueueNews()
    revalidatePath("/")
    revalidatePath("/archive")
    revalidatePath("/sitemap.xml")
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error running news crawl:", error)
    return NextResponse.json(
      { success: false, error: "Failed to run news aggregation crawl" },
      { status: 500 }
    )
  }
}