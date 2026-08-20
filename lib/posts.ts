import { Redis } from "@upstash/redis"
import { isCategory as isKnownCategory, type Category, type Post, type SiteSettings } from "./types"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "",
})

export { redis }

const POSTS_KEY = "posts"
const PASSWORD_KEY = "admin_password"
const SETTINGS_KEY = "site_settings"

const sampleContent = {
  heron: `
    <p>Hayao Miyazaki's return arrived with the quiet confidence of a folktale told beside a window at dusk. <strong>The Boy and the Heron</strong> has continued to gather awards attention, sold-out repertory screenings, and new viewers who discover its grief, wonder, and strange humor one scene at a time.</p>
    <p>The film follows Mahito through a world that feels handmade from memory: towers, birds, paper charms, and impossible rooms. Its power is not in explaining every secret, but in trusting the audience to sit with mystery.</p>
    <h2>Why it still matters</h2>
    <p>For longtime Ghibli fans, the movie feels like an artist speaking across decades. For new audiences, it is a generous doorway into the studio's larger language of flight, food, silence, and courage.</p>
    <p>Expect more anniversary screenings, expanded home release conversations, and continued critical essays as the film settles into the canon.</p>
  `,
  totoro: `
    <p>Thirty-six years on, <strong>My Neighbor Totoro</strong> remains one of animation's gentlest miracles. It has no villain, no manufactured twist, and no noisy race toward spectacle. Instead, it gives us rain, seeds, illness, dust, and a forest spirit who appears only when childhood is open enough to see him.</p>
    <p>That restraint is why the film keeps working. Totoro does not demand that viewers become children again. It simply remembers how children notice the world.</p>
    <h2>A living classic</h2>
    <p>Every generation finds a slightly different movie inside it. Children meet a soft giant. Parents recognize waiting rooms and worry. Artists study its timing, color, and patience.</p>
    <p>Its legacy is not nostalgia alone. It is proof that quiet stories can become enormous.</p>
  `,
  premieres: `
    <p>August is packed with anime premieres, returning favorites, and a few surprise streaming drops worth watching closely. Seasonal calendars can feel crowded, so we are tracking the releases that seem most likely to spark real conversation.</p>
    <p>Look for fantasy series with painterly backgrounds, music-driven dramas, and intimate slice-of-life stories that give their characters room to breathe.</p>
    <h2>What to watch for</h2>
    <p>Premiere weeks are always noisy, but the strongest shows usually reveal themselves through small choices: a confident opening scene, a memorable score cue, or a character detail that feels lived in.</p>
    <p>Keep your calendar flexible. The best discovery of the month is often the title nobody was shouting about.</p>
  `,
  park: `
    <p>Ghibli Park in Aichi Prefecture is expanding its already immersive world with new themed areas designed around the studio's handmade sense of place. The park has always favored atmosphere over roller-coaster spectacle, and the expansion appears to continue that philosophy.</p>
    <p>Visitors can expect carefully built environments, domestic interiors, forest paths, and details that reward slow looking.</p>
    <h2>A park built for wandering</h2>
    <p>What makes the project special is its refusal to flatten the films into simple attractions. Ghibli worlds are places with weather, clutter, kitchens, workshops, and thresholds.</p>
    <p>The next phase should give fans more of what the park does best: spaces that feel remembered rather than manufactured.</p>
  `
}

export const seedPosts: Post[] = [
  {
    id: "boy-and-the-heron-2024-updates",
    title: "The Boy and the Heron - Everything We Know",
    excerpt:
      "Miyazaki's latest masterpiece continues to break records. Here is a full breakdown of awards, screenings, and what comes next.",
    content: sampleContent.heron,
    category: "ghibli-news",
    coverColor: "#667eea",
    author: "Ghibli Gazette Staff",
    published: true,
    date: "2024-08-15",
    tags: ["Ghibli", "Miyazaki", "The Boy and the Heron"],
    views: 0
  },
  {
    id: "totoro-36-years-legacy",
    title: "My Neighbor Totoro at 36: Why It Never Gets Old",
    excerpt:
      "Three decades later and Totoro still makes grown adults cry. We explore why this film is timeless and what it means to a new generation.",
    content: sampleContent.totoro,
    category: "review",
    coverColor: "#43b89c",
    author: "Ghibli Gazette Staff",
    published: true,
    date: "2024-08-10",
    tags: ["Totoro", "Classic", "Review"],
    views: 0
  },
  {
    id: "anime-premieres-august-2024",
    title: "Upcoming Anime Premieres - August 2024",
    excerpt:
      "From new seasons to surprise drops, here is every anime premiere you need to mark on your calendar this month.",
    content: sampleContent.premieres,
    category: "premiere",
    coverColor: "#f093fb",
    author: "Ghibli Gazette Staff",
    published: true,
    date: "2024-08-01",
    tags: ["Premiere", "Seasonal", "Anime"],
    views: 0
  },
  {
    id: "ghibli-theme-park-expansion",
    title: "Studio Ghibli Theme Park Announces Expansion",
    excerpt:
      "The Ghibli Park in Aichi Prefecture is getting two new massive zones. Here is what has been confirmed and when they open.",
    content: sampleContent.park,
    category: "new-release",
    coverColor: "#F4A261",
    author: "Ghibli Gazette Staff",
    published: true,
    date: "2024-07-28",
    tags: ["Ghibli Park", "News", "Japan"],
    views: 0
  }
]

function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function parsePosts(data: unknown): Post[] {
  if (Array.isArray(data)) {
    return data as Post[]
  }
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed as Post[]
    } catch {
      // ignore JSON parse error
    }
  }
  return []
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const raw = await withTimeout(redis.get(POSTS_KEY), 4000)
    const posts = parsePosts(raw)
    if (posts.length > 0) {
      return sortByDateDesc(posts)
    }
    return []
  } catch (error) {
    console.error("Error fetching posts from Redis:", error)
    return seedPosts
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Redis operation timed out after ${ms}ms`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}

// Cache the seed state per server instance so we don't hammer Redis on every
// ISR revalidation or runtime render.
let seedChecked = false

export async function seedIfEmpty(): Promise<void> {
  if (seedChecked) return
  try {
    const raw = await withTimeout(redis.get(POSTS_KEY), 4000)
    const posts = parsePosts(raw)
    if (posts.length === 0) {
      await withTimeout(redis.set(POSTS_KEY, seedPosts), 4000)
    }
    seedChecked = true
  } catch (error) {
    console.error("Error seeding posts in Redis:", error)
    seedChecked = true
  }
}

export async function getPostBySlug(id: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.id === id) ?? null
}

export async function createPost(post: Post): Promise<void> {
  const posts = await getAllPosts()
  await withTimeout(redis.set(POSTS_KEY, sortByDateDesc([...posts, post])), 4000)
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const posts = await getAllPosts()
  let updated: Post | null = null
  const nextPosts = posts.map((post) => {
    if (post.id !== id) return post
    updated = { ...post, ...data, id }
    return updated
  })

  if (!updated) return null
  await withTimeout(redis.set(POSTS_KEY, sortByDateDesc(nextPosts)), 4000)
  return updated
}

export async function deletePost(id: string): Promise<void> {
  const posts = await getAllPosts()
  await withTimeout(
    redis.set(
      POSTS_KEY,
      posts.filter((post) => post.id !== id)
    ),
    4000
  )
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return slug || `story-${Date.now()}`
}

export function isCategory(value: string | null | undefined): value is Category {
  return isKnownCategory(value)
}

export async function getAdminPassword(): Promise<string> {
  try {
    const pass = await redis.get<string>(PASSWORD_KEY)
    if (typeof pass === "string" && pass.length > 0) {
      return pass
    }
  } catch (error) {
    console.error("Error fetching admin password:", error)
  }
  return process.env.ADMIN_PASSWORD ?? "ghibli2024"
}

export async function setAdminPassword(password: string): Promise<void> {
  await withTimeout(redis.set(PASSWORD_KEY, password), 4000)
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    siteName: "Ghibli Gazette",
    tagline: "Your anime & manga news hub — reviews, releases, premieres, and industry intel.",
    instagram: "",
    discord: "",
    twitter: ""
  }
  try {
    const settings = await withTimeout(redis.get<SiteSettings>(SETTINGS_KEY), 4000)
    if (settings && typeof settings === "object") {
      return {
        siteName: settings.siteName || defaultSettings.siteName,
        tagline: settings.tagline || defaultSettings.tagline,
        instagram: settings.instagram ?? "",
        discord: settings.discord ?? "",
        twitter: settings.twitter ?? ""
      }
    }
  } catch (error) {
    console.error("Error fetching site settings:", error)
  }
  return defaultSettings
}

export async function setSiteSettings(settings: SiteSettings): Promise<void> {
  await withTimeout(redis.set(SETTINGS_KEY, settings), 4000)
}
