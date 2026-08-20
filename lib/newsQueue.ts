import { redis } from "./posts"
import { createPost, getAllPosts, slugify } from "./posts"
import { type Post, type QueuedStory } from "./types"
import { fetchAllRawNews, formatAndRewriteNewsItem } from "./newsAggregator"

const QUEUE_KEY = "news_queue"
const LAST_CRAWL_KEY = "last_crawl_at"

/** Stories sitting in the review queue longer than this get auto-published */
const AUTO_PUBLISH_AGE_MS = 24 * 60 * 60 * 1000
const AUTO_PUBLISH_MAX_PER_CRAWL = 5

export async function getLastCrawlTime(): Promise<number | null> {
  try {
    const raw = await redis.get(LAST_CRAWL_KEY)
    const ts = typeof raw === "string" ? parseInt(raw, 10) : NaN
    return Number.isFinite(ts) && ts > 0 ? ts : null
  } catch (error) {
    console.error("Error reading last crawl time:", error)
    return null
  }
}

async function setLastCrawlTime(): Promise<void> {
  try {
    await redis.set(LAST_CRAWL_KEY, Date.now().toString())
  } catch (error) {
    console.error("Error saving last crawl time:", error)
  }
}

function parseQueue(data: unknown): QueuedStory[] {
  if (Array.isArray(data)) {
    return data as QueuedStory[]
  }
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed as QueuedStory[]
    } catch {
      // ignore json error
    }
  }
  return []
}

export async function getQueuedStories(): Promise<QueuedStory[]> {
  try {
    const raw = await redis.get(QUEUE_KEY)
    const queue = parseQueue(raw)
    return queue.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error reading news queue from Redis:", error)
    return []
  }
}

export async function saveQueue(queue: QueuedStory[]): Promise<void> {
  try {
    await redis.set(QUEUE_KEY, queue.slice(0, 100)) // Keep up to 100 latest queued drafts
  } catch (error) {
    console.error("Error saving news queue to Redis:", error)
  }
}

/**
 * Crawl news sources, run AI rewriter, and add new stories to the review queue.
 * Also auto-publishes stale pending stories so the site stays fresh on its own.
 */
export async function crawlAndQueueNews(): Promise<{
  addedCount: number
  totalInQueue: number
  autoPublishedCount: number
}> {
  await setLastCrawlTime()

  const [existingQueue, existingPosts, rawNews] = await Promise.all([
    getQueuedStories(),
    getAllPosts(),
    fetchAllRawNews()
  ])

  const existingTitles = new Set([
    ...existingQueue.map((q) => q.originalTitle.toLowerCase().trim()),
    ...existingQueue.map((q) => q.title.toLowerCase().trim()),
    ...existingPosts.map((p) => p.title.toLowerCase().trim())
  ])

  const newQueuedItems: QueuedStory[] = []

  for (const rawItem of rawNews) {
    const rawTitleLower = rawItem.title.toLowerCase().trim()
    if (!existingTitles.has(rawTitleLower)) {
      const rewritten = formatAndRewriteNewsItem(rawItem)
      const rewrittenTitleLower = rewritten.title.toLowerCase().trim()

      if (!existingTitles.has(rewrittenTitleLower)) {
        existingTitles.add(rawTitleLower)
        existingTitles.add(rewrittenTitleLower)
        newQueuedItems.push(rewritten)
      }
    }
  }

  const updatedQueue = [...newQueuedItems, ...existingQueue]
  await saveQueue(updatedQueue)

  const autoPublishedCount = await autoPublishStaleStories()

  return {
    addedCount: newQueuedItems.length,
    totalInQueue: updatedQueue.filter((q) => q.status === "pending").length,
    autoPublishedCount
  }
}

/**
 * Auto-publishes pending queue stories that have been waiting long enough,
 * so the breaking news ticker and homepage stay current without manual review.
 */
async function autoPublishStaleStories(): Promise<number> {
  const queue = await getQueuedStories()
  const cutoff = Date.now() - AUTO_PUBLISH_AGE_MS
  let published = 0

  for (const item of queue) {
    if (published >= AUTO_PUBLISH_MAX_PER_CRAWL) break
    if (item.status !== "pending") continue

    const createdAt = new Date(item.createdAt).getTime()
    if (!Number.isFinite(createdAt) || createdAt > cutoff) continue

    // Safety guards: skip drafts that look incomplete or untrustworthy
    if (!item.title || item.title.trim().length < 10) continue
    if (!item.content || item.content.replace(/<[^>]*>/g, "").trim().length < 60) continue
    if (!item.sourceUrl || !item.sourceUrl.startsWith("http")) continue

    await approveAndPublishStory(item.id)
    published++
  }

  if (published > 0) {
    console.log(`Auto-published ${published} stale queued stories`)
  }
  return published
}

/**
 * Approve a queued story and publish it as a live post on the site
 */
export async function approveAndPublishStory(
  id: string,
  overrides?: Partial<QueuedStory>
): Promise<Post | null> {
  const queue = await getQueuedStories()
  const storyIndex = queue.findIndex((item) => item.id === id)

  if (storyIndex === -1) {
    return null
  }

  const target = { ...queue[storyIndex], ...overrides }
  const slug = slugify(target.title)

  // Check if post id already exists
  const existingPosts = await getAllPosts()
  const finalId = existingPosts.some((p) => p.id === slug) ? `${slug}-${Date.now().toString().slice(-4)}` : slug

  const newPost: Post = {
    id: finalId,
    title: target.title,
    excerpt: target.excerpt,
    content: target.content,
    category: target.category,
    coverColor: target.coverColor || "#E8643A",
    coverImage: target.coverImage,
    author: "Ghibli Gazette Staff",
    date: new Date().toISOString().split("T")[0],
    published: true,
    featured: false,
    tags: target.tags || ["Anime News"],
    views: 0
  }

  // 1. Create the live post
  await createPost(newPost)

  // 2. Mark queue item as approved
  queue[storyIndex] = { ...target, status: "approved" }
  await saveQueue(queue)

  return newPost
}

/**
 * Dismiss / delete a story from the queue
 */
export async function dismissQueuedStory(id: string): Promise<boolean> {
  const queue = await getQueuedStories()
  const filtered = queue.filter((item) => item.id !== id)
  await saveQueue(filtered)
  return true
}

/**
 * Update a queued story (e.g. user edited title or content in admin before approving)
 */
export async function updateQueuedStory(
  id: string,
  updates: Partial<QueuedStory>
): Promise<QueuedStory | null> {
  const queue = await getQueuedStories()
  const index = queue.findIndex((item) => item.id === id)

  if (index === -1) return null

  const updated = { ...queue[index], ...updates, id }
  queue[index] = updated
  await saveQueue(queue)
  return updated
}
