"use client"

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react"
import PasswordGate from "./PasswordGate"
import {
  categories,
  categoryGradient,
  categoryLabel,
  getPostCoverImage,
  type Category,
  type Post,
  type QueuedStory,
  type SiteSettings
} from "@/lib/types"

type Tab = "dashboard" | "queue" | "new" | "posts" | "settings"
type PostFilter = "all" | "published" | "drafts" | Category
type QueueFilter = "pending" | "approved" | "all"

const emptyPost: Partial<Post> = {
  title: "",
  excerpt: "",
  content: "<p>Begin your story here...</p>",
  category: "general",
  coverColor: "#E8643A",
  coverImage: "",
  author: "Ghibli Gazette Staff",
  published: false,
  featured: false,
  tags: []
}

const swatches = ["#667eea", "#E8643A", "#2D9966", "#C94FAE", "#4A90D9"]

export default function AdminEditor() {
  const [tab, setTab] = useState<Tab>("dashboard")
  const [posts, setPosts] = useState<Post[]>([])
  const [queue, setQueue] = useState<QueuedStory[]>([])
  const [draft, setDraft] = useState<Partial<Post>>(emptyPost)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [view, setView] = useState<"edit" | "preview">("edit")
  const [filter, setFilter] = useState<PostFilter>("all")
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("pending")
  const [toast, setToast] = useState("")
  const [confirmPost, setConfirmPost] = useState<Post | null>(null)
  const [settings, setSettings] = useState<SiteSettings>({ instagram: "", discord: "", twitter: "" })
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [settingsMessage, setSettingsMessage] = useState("")
  const [crawling, setCrawling] = useState(false)
  const [previewStory, setPreviewStory] = useState<QueuedStory | null>(null)

  async function loadPosts() {
    try {
      const response = await fetch("/api/posts")
      const data = (await response.json()) as Post[]
      setPosts(data)
    } catch (e) {
      console.error("Error loading posts:", e)
    }
  }

  async function loadQueue() {
    try {
      const response = await fetch("/api/queue")
      const data = (await response.json()) as QueuedStory[]
      if (Array.isArray(data)) {
        setQueue(data)
      }
    } catch (e) {
      console.error("Error loading queue:", e)
    }
  }

  async function loadSettings() {
    try {
      const response = await fetch("/api/auth")
      const data = (await response.json()) as { settings: SiteSettings }
      setSettings(data.settings)
    } catch (e) {
      console.error("Error loading settings:", e)
    }
  }

  useEffect(() => {
    loadPosts()
    loadQueue()
    loadSettings()
  }, [])

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.published).length,
      drafts: posts.filter((post) => !post.published).length,
      queuePending: queue.filter((item) => item.status === "pending").length,
      categories: new Set(posts.map((post) => post.category)).size
    }),
    [posts, queue]
  )

  const filteredPosts = useMemo(() => {
    if (filter === "published") return posts.filter((post) => post.published)
    if (filter === "drafts") return posts.filter((post) => !post.published)
    if (filter === "all") return posts
    return posts.filter((post) => post.category === filter)
  }, [filter, posts])

  const filteredQueue = useMemo(() => {
    if (queueFilter === "all") return queue
    return queue.filter((item) => item.status === queueFilter)
  }, [queueFilter, queue])

  const tagsText = (draft.tags ?? []).join(", ")

  function updateDraft<K extends keyof Post>(key: K, value: Post[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function editPost(post: Post) {
    setDraft(post)
    setEditingId(post.id)
    setView("edit")
    setTab("new")
  }

  function resetForm() {
    setDraft(emptyPost)
    setEditingId(null)
    setView("edit")
  }

  async function savePost(published: boolean) {
    const payload: Partial<Post> = {
      ...draft,
      published,
      excerpt: (draft.excerpt ?? "").slice(0, 180),
      tags: draft.tags ?? [],
      author: draft.author?.trim() || "Ghibli Gazette Staff"
    }

    const response = await fetch(editingId ? `/api/posts/${editingId}` : "/api/posts/create", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      setToast("The story could not be saved")
      return
    }

    await loadPosts()
    setToast(published ? "Your story is live on the site! ✦" : "Draft saved ✦")
    window.setTimeout(() => setToast(""), 2400)
    if (!editingId) resetForm()
  }

  async function handleCrawlNews() {
    setCrawling(true)
    setToast("📡 AI Agent scanning Anime News Network, MAL, CBR...")
    try {
      const response = await fetch("/api/queue/crawl", { method: "POST" })
      const result = await response.json()
      await loadQueue()
      if (result.addedCount > 0) {
        setToast(`✨ AI Agent fetched & formatted ${result.addedCount} new stories!`)
      } else {
        setToast("✅ All anime news feeds are up to date.")
      }
    } catch (e) {
      console.error(e)
      setToast("⚠️ Error during crawl. Please check feed connectivity.")
    } finally {
      setCrawling(false)
      window.setTimeout(() => setToast(""), 3500)
    }
  }

  async function handleApproveStory(story: QueuedStory) {
    try {
      const response = await fetch(`/api/queue/${story.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      if (response.ok) {
        setToast("🚀 Story approved and published live!")
        await Promise.all([loadQueue(), loadPosts()])
      } else {
        setToast("Failed to publish story")
      }
    } catch (e) {
      console.error(e)
      setToast("Error publishing story")
    } finally {
      window.setTimeout(() => setToast(""), 2500)
    }
  }

  async function handleDismissStory(id: string) {
    try {
      await fetch(`/api/queue/${id}`, { method: "DELETE" })
      setToast("Story dismissed from queue")
      await loadQueue()
    } catch (e) {
      console.error(e)
    } finally {
      window.setTimeout(() => setToast(""), 2000)
    }
  }

  async function cycleStoryImage(story: QueuedStory) {
    const pool = [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428033-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
    ]
    const currentIndex = pool.indexOf(story.coverImage)
    const nextIndex = (currentIndex + 1) % pool.length
    const nextImage = pool[nextIndex]

    await fetch(`/api/queue/${story.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImage: nextImage, confidenceScore: 98 })
    })
    await loadQueue()
    setToast("Visual updated ✦")
    window.setTimeout(() => setToast(""), 1500)
  }

  function handleEditQueuedInDesk(story: QueuedStory) {
    setDraft({
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      category: story.category,
      coverColor: story.coverColor || "#E8643A",
      coverImage: story.coverImage,
      author: "Ghibli Gazette Staff",
      published: true,
      featured: false,
      tags: story.tags || ["Anime News"]
    })
    setEditingId(null)
    setView("edit")
    setTab("new")
    setToast("Loaded into editor desk — review and publish! ✦")
    window.setTimeout(() => setToast(""), 2500)
  }

  function insertFormat(tag: string, closeTag: string = "") {
    const textarea = document.getElementById("content-editor-textarea") as HTMLTextAreaElement | null
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const current = draft.content || ""
    const selected = current.substring(start, end)
    const replacement = `${tag}${selected || "text"}${closeTag}`
    const next = current.substring(0, start) + replacement + current.substring(end)
    updateDraft("content", next)
  }

  function handleTabKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") return
    event.preventDefault()
    const element = event.currentTarget
    const start = element.selectionStart
    const end = element.selectionEnd
    const value = element.value
    const next = `${value.substring(0, start)}  ${value.substring(end)}`
    updateDraft("content", next)
    window.requestAnimationFrame(() => {
      element.selectionStart = start + 2
      element.selectionEnd = start + 2
    })
  }

  async function deleteCurrentPost() {
    if (!confirmPost) return
    await fetch(`/api/posts/${confirmPost.id}`, { method: "DELETE" })
    setConfirmPost(null)
    await loadPosts()
    setToast("Story deleted")
    window.setTimeout(() => setToast(""), 2200)
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSettingsMessage("")

    if (passwords.next && passwords.next !== passwords.confirm) {
      setSettingsMessage("New passwords do not match")
      return
    }

    const response = await fetch("/api/auth", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwords.current,
        newPassword: passwords.next || undefined,
        settings
      })
    })

    if (!response.ok) {
      setSettingsMessage("Current password is incorrect")
      return
    }

    setPasswords({ current: "", next: "", confirm: "" })
    setSettingsMessage("Settings saved successfully")
  }

  function logout() {
    sessionStorage.removeItem("gz_auth")
    window.location.reload()
  }

  return (
    <PasswordGate>
      <main className="min-h-screen bg-[radial-gradient(circle_at_80%_10%,rgba(232,100,58,0.12),transparent_28rem),#0A0A0F] text-cream">
        {toast && (
          <div className="toast fixed left-1/2 top-5 z-[100] rounded-full border border-amber/40 bg-[#16161F]/95 px-6 py-3 text-sm font-black text-amber shadow-2xl backdrop-blur">
            {toast}
          </div>
        )}

        <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="border-b border-white/10 bg-[#111118]/90 p-4 backdrop-blur md:border-b-0 md:border-r md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 md:block">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold tracking-wider text-amber">GHIBLI</span>
                  <span className="font-display text-2xl font-bold tracking-wider text-white">GAZETTE</span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-muted transition hover:border-amber hover:text-amber md:hidden"
                >
                  Logout
                </button>
              </div>

              <nav className="mt-8 flex gap-2 overflow-x-auto md:grid md:gap-2">
                {[
                  ["dashboard", "📊 Dashboard", 0],
                  ["queue", "📥 News Queue", stats.queuePending],
                  ["new", "✦ Editor Desk", 0],
                  ["posts", "📝 All Posts", stats.total],
                  ["settings", "⚙️ Settings", 0]
                ].map(([id, label, count]) => (
                  <button
                    key={id as string}
                    onClick={() => setTab(id as Tab)}
                    className={`flex items-center justify-between shrink-0 rounded-[8px] border-l-4 px-4 py-3 text-left text-sm font-bold transition ${
                      tab === id
                        ? "border-amber bg-white/[0.08] text-amber"
                        : "border-transparent text-muted hover:bg-white/[0.04] hover:text-cream"
                    }`}
                  >
                    <span>{label as string}</span>
                    {Number(count) > 0 && (
                      <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-black text-black">
                        {count as number}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8 hidden md:block">
              <button onClick={logout} className="btn btn-outline w-full text-xs">
                Log Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="p-4 pb-28 md:p-8 overflow-y-auto">
            {/* ─── 1. DASHBOARD TAB ─── */}
            {tab === "dashboard" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="font-display text-3xl md:text-4xl italic font-bold text-white">Editorial Dashboard</h1>
                  <button
                    onClick={handleCrawlNews}
                    disabled={crawling}
                    className="btn btn-primary text-sm flex items-center gap-2"
                  >
                    <span>{crawling ? "📡 Scanning..." : "🔄 Crawl & Fetch News"}</span>
                  </button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Live Published Stories", stats.published, "#2D9966"],
                    ["Pending Review Queue", stats.queuePending, "#E8643A"],
                    ["Unpublished Drafts", stats.drafts, "#667eea"],
                    ["Active Categories", stats.categories, "#C94FAE"]
                  ].map(([label, value, color]) => (
                    <div key={label as string} className="glass rounded-[8px] p-5 border border-white/10 bg-[#16161F]">
                      <p className="text-3xl font-black" style={{ color: color as string }}>
                        {value as number}
                      </p>
                      <p className="mt-2 text-sm font-bold text-muted">{label as string}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Queue Alert */}
                {stats.queuePending > 0 && (
                  <div className="mt-6 flex items-center justify-between rounded-[8px] border border-amber/30 bg-amber/10 p-5">
                    <div>
                      <p className="font-bold text-amber">
                        ✦ You have {stats.queuePending} AI-crawled stories awaiting editorial review!
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Sources: Anime News Network, MyAnimeList, CBR, Kotaku, Sportskeeda.
                      </p>
                    </div>
                    <button onClick={() => setTab("queue")} className="btn btn-primary text-xs">
                      Open Review Queue →
                    </button>
                  </div>
                )}

                {/* Recent Posts Table */}
                <div className="glass mt-8 overflow-hidden rounded-[8px] border border-white/10 bg-[#16161F]">
                  <div className="border-b border-white/10 p-5 flex items-center justify-between">
                    <h2 className="font-display text-xl italic font-bold text-white">Recent Published Stories</h2>
                    <button onClick={() => setTab("posts")} className="text-xs text-amber font-bold hover:underline">
                      View All ({posts.length}) →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="text-muted border-b border-white/5 bg-white/[0.02]">
                        <tr>
                          <th className="p-4">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.slice(0, 6).map((post) => (
                          <tr key={post.id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                            <td className="p-4 font-bold text-white max-w-[320px] truncate">{post.title}</td>
                            <td className="p-4 text-muted">
                              <span className="badge" style={{ fontSize: "10px", padding: "2px 6px" }}>
                                {categoryLabel(post.category)}
                              </span>
                            </td>
                            <td className="p-4">
                              <StatusBadge published={post.published} />
                            </td>
                            <td className="p-4 text-muted">{post.date.slice(0, 10)}</td>
                            <td className="p-4 flex gap-2">
                              <button onClick={() => editPost(post)} className="text-amber font-bold text-xs hover:underline">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 2. AI NEWS REVIEW QUEUE TAB ─── */}
            {tab === "queue" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl italic font-bold text-white">
                      AI News Review Queue
                    </h1>
                    <p className="text-sm text-muted mt-1">
                      Crawled, deduplicated, and formatted by the Ghibli Gazette AI agent. Review and publish with 1 click.
                    </p>
                  </div>
                  <button
                    onClick={handleCrawlNews}
                    disabled={crawling}
                    className="btn btn-primary text-sm flex items-center gap-2"
                  >
                    <span>{crawling ? "📡 Crawling Sources..." : "🔄 Crawl & Fetch News"}</span>
                  </button>
                </div>

                {/* Queue Filter Bar */}
                <div className="mt-6 flex gap-2 border-b border-white/10 pb-3">
                  {(["pending", "approved", "all"] as QueueFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setQueueFilter(f)}
                      className={`rounded-full px-4 py-1.5 text-xs font-black transition ${
                        queueFilter === f ? "bg-amber text-black" : "bg-white/[0.04] text-muted hover:text-white"
                      }`}
                    >
                      {f === "pending"
                        ? `Pending (${queue.filter((q) => q.status === "pending").length})`
                        : f === "approved"
                        ? `Approved (${queue.filter((q) => q.status === "approved").length})`
                        : `All (${queue.length})`}
                    </button>
                  ))}
                </div>

                {/* Queue Items */}
                {filteredQueue.length === 0 ? (
                  <div className="mt-8 rounded-[8px] border border-white/10 bg-[#16161F] p-12 text-center">
                    <p className="font-display text-2xl italic text-white">No stories in this queue</p>
                    <p className="mt-2 text-sm text-muted">
                      Click the "Crawl & Fetch News" button above to scan top anime outlets and generate ready-to-publish drafts.
                    </p>
                    <button
                      onClick={handleCrawlNews}
                      disabled={crawling}
                      className="btn btn-primary mt-6 text-sm"
                    >
                      {crawling ? "Scanning Feeds..." : "Scan & Fetch News Now"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4">
                    {filteredQueue.map((story) => (
                      <article
                        key={story.id}
                        className="rounded-[8px] border border-white/10 bg-[#16161F] p-5 transition hover:border-amber/40"
                      >
                        <div className="grid gap-4 md:grid-cols-[140px_1fr_auto]">
                          {/* Image Preview with Controls */}
                          <div className="flex flex-col gap-1.5 w-full md:w-36">
                            <div className="relative h-24 w-full overflow-hidden rounded-[6px] bg-[#1E1E2A]">
                              <img
                                src={story.coverImage || getPostCoverImage(story)}
                                alt={story.title}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-amber">
                                ✓ {story.confidenceScore}% Match
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => cycleStoryImage(story)}
                              className="rounded bg-white/[0.06] hover:bg-white/[0.12] px-2 py-1 text-[10px] font-bold text-muted hover:text-cream text-center transition"
                              title="Cycle through official high-res visual variations"
                            >
                              ⚡ Change Visual
                            </button>
                          </div>

                          {/* Content Details */}
                          <div className="flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="badge" style={{ fontSize: "10px", padding: "2px 6px" }}>
                                  {categoryLabel(story.category)}
                                </span>
                                <span className="text-xs text-muted">
                                  Source: <strong className="text-cream">{story.sourceName}</strong>
                                </span>
                                {story.sourceUrl && (
                                  <a
                                    href={story.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-amber hover:underline"
                                  >
                                    [Original Link ↗]
                                  </a>
                                )}
                              </div>

                              <h3 className="font-display text-lg font-bold text-white line-clamp-2">
                                {story.title}
                              </h3>

                              <p className="mt-1.5 text-xs text-muted line-clamp-2">{story.excerpt}</p>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1">
                              {story.tags.map((t) => (
                                <span
                                  key={t}
                                  className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-muted"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0">
                            {story.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveStory(story)}
                                  className="btn btn-primary text-xs w-full py-2"
                                  title="Publish immediately to homepage"
                                >
                                  🚀 Approve & Publish
                                </button>
                                <button
                                  onClick={() => handleEditQueuedInDesk(story)}
                                  className="btn btn-outline text-xs w-full py-2"
                                  title="Load into rich text editor"
                                >
                                  ✏️ Polish in Desk
                                </button>
                                <button
                                  onClick={() => handleDismissStory(story.id)}
                                  className="btn btn-outline text-xs text-[#ff7b7b] hover:border-[#ff7b7b] py-1.5"
                                >
                                  ✕ Dismiss
                                </button>
                              </>
                            ) : (
                              <span className="rounded bg-[#2D9966]/20 px-3 py-1.5 text-center text-xs font-bold text-[#7dffb2]">
                                ✓ Approved
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── 3. NEW STORY / EDIT STORY TAB ─── */}
            {tab === "new" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl italic font-bold text-white">
                      {editingId ? "Edit Story" : "Editorial Desk"}
                    </h1>
                    <p className="text-sm text-muted mt-1">Write, format, and publish articles.</p>
                  </div>
                  {editingId && (
                    <button onClick={resetForm} className="btn btn-outline min-h-0 px-4 py-2 text-sm">
                      Start New Story
                    </button>
                  )}
                </div>

                <div className="mt-8 grid gap-5 max-w-4xl">
                  {/* Headline */}
                  <div>
                    <label className="text-xs font-black text-muted uppercase tracking-wider mb-2 block">
                      Headline
                    </label>
                    <input
                      value={draft.title ?? ""}
                      onChange={(event) => updateDraft("title", event.target.value)}
                      className="w-full rounded-[8px] border border-white/10 bg-[#16161F] px-5 py-4 font-display text-2xl md:text-3xl italic font-bold text-white outline-none transition placeholder:text-muted focus:border-amber"
                      placeholder="Enter a compelling story title..."
                    />
                  </div>

                  {/* Excerpt */}
                  <label className="grid gap-2">
                    <div className="flex justify-between items-center text-xs font-black text-muted uppercase tracking-wider">
                      <span>Excerpt / Teaser</span>
                      <span className={(draft.excerpt?.length ?? 0) > 180 ? "text-[#ff7b7b]" : "text-amber"}>
                        {draft.excerpt?.length ?? 0}/180
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={draft.excerpt ?? ""}
                      onChange={(event) => updateDraft("excerpt", event.target.value.slice(0, 180))}
                      className="rounded-[8px] border border-white/10 bg-[#16161F] px-4 py-3 text-cream text-sm outline-none transition placeholder:text-muted focus:border-amber"
                      placeholder="A short, engaging two-sentence summary..."
                    />
                  </label>

                  {/* Category & Tags */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-xs font-black text-muted uppercase tracking-wider">Category</span>
                      <select
                        value={draft.category ?? "general"}
                        onChange={(event) => updateDraft("category", event.target.value as Category)}
                        className="rounded-[8px] border border-white/10 bg-[#16161F] px-4 py-3 text-cream outline-none focus:border-amber"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-black text-muted uppercase tracking-wider">Tags (comma separated)</span>
                      <input
                        value={tagsText}
                        onChange={(event) =>
                          updateDraft(
                            "tags",
                            event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                          )
                        }
                        className="rounded-[8px] border border-white/10 bg-[#16161F] px-4 py-3 text-cream outline-none focus:border-amber"
                        placeholder="Studio Ghibli, Miyazaki, Review"
                      />
                    </label>
                  </div>

                  {/* Cover Image URL */}
                  <label className="grid gap-2">
                    <span className="text-xs font-black text-muted uppercase tracking-wider">Cover Image URL (optional)</span>
                    <input
                      value={draft.coverImage ?? ""}
                      onChange={(event) => updateDraft("coverImage", event.target.value)}
                      className="rounded-[8px] border border-white/10 bg-[#16161F] px-4 py-3 text-cream outline-none focus:border-amber text-sm font-mono"
                      placeholder="https://images.unsplash.com/... or leave blank for auto-matching"
                    />
                  </label>

                  {/* Rich Text Editor Toolbar */}
                  <div className="glass rounded-[8px] border border-white/10 bg-[#16161F] p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      {/* Formatting Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => insertFormat("<strong>", "</strong>")}
                          className="rounded px-2.5 py-1 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-cream"
                        >
                          Bold
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("<em>", "</em>")}
                          className="rounded px-2.5 py-1 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-cream"
                        >
                          Italic
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("<h2>", "</h2>")}
                          className="rounded px-2.5 py-1 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-cream"
                        >
                          H2 Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("<blockquote>", "</blockquote>")}
                          className="rounded px-2.5 py-1 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-cream"
                        >
                          Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat('<a href="https://..." target="_blank">', "</a>")}
                          className="rounded px-2.5 py-1 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-cream"
                        >
                          Link
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("<p>", "</p>")}
                          className="rounded px-2.5 py-1 text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-cream"
                        >
                          Paragraph
                        </button>
                      </div>

                      {/* View Toggles */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setView("edit")}
                          className={`rounded-full px-3 py-1 text-xs font-black transition ${
                            view === "edit" ? "bg-amber text-black" : "text-muted hover:text-white"
                          }`}
                        >
                          Code Editor
                        </button>
                        <button
                          type="button"
                          onClick={() => setView("preview")}
                          className={`rounded-full px-3 py-1 text-xs font-black transition ${
                            view === "preview" ? "bg-amber text-black" : "text-muted hover:text-white"
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>
                    </div>

                    {view === "edit" ? (
                      <textarea
                        id="content-editor-textarea"
                        rows={18}
                        value={draft.content ?? ""}
                        onKeyDown={handleTabKey}
                        onChange={(event) => updateDraft("content", event.target.value)}
                        className="w-full rounded-[6px] border border-white/5 bg-[#0A0A0F] p-4 font-mono text-sm leading-relaxed text-cream outline-none focus:border-amber"
                        placeholder="Write your HTML content here..."
                      />
                    ) : (
                      <div
                        className="prose-article min-h-[380px] rounded-[6px] border border-white/5 bg-[#0A0A0F] p-6"
                        dangerouslySetInnerHTML={{ __html: draft.content ?? "" }}
                      />
                    )}
                  </div>

                  {/* Publish & Draft Buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row mt-4">
                    <button
                      type="button"
                      onClick={() => savePost(false)}
                      className="btn btn-outline flex-1 py-3 text-sm"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => savePost(true)}
                      className="btn btn-primary flex-1 py-3 text-sm"
                    >
                      Publish to Live Site ✦
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 4. ALL POSTS TAB ─── */}
            {tab === "posts" && (
              <div>
                <h1 className="font-display text-3xl md:text-4xl italic font-bold text-white">All Stories</h1>
                <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                  {["all", "published", "drafts", ...categories.map((category) => category.id)].map((id) => (
                    <button
                      key={id}
                      onClick={() => setFilter(id as PostFilter)}
                      className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-black transition ${
                        filter === id ? "bg-amber text-black" : "bg-white/[0.04] text-muted hover:text-white"
                      }`}
                    >
                      {id === "all"
                        ? "All Stories"
                        : id === "published"
                        ? "Published"
                        : id === "drafts"
                        ? "Drafts"
                        : categoryLabel(id as Category)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-3">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="glass grid gap-3 rounded-[8px] p-4 md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto] md:items-center border border-white/10 bg-[#16161F]"
                    >
                      <span className="h-3.5 w-3.5 rounded-full" style={{ background: post.coverColor || "#E8643A" }} />
                      <p className="truncate font-bold text-white">{post.title}</p>
                      <span
                        className="w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                        style={{ background: categoryGradient(post.category) }}
                      >
                        {categoryLabel(post.category)}
                      </span>
                      <StatusBadge published={post.published} />
                      <time className="text-xs font-bold text-muted">{post.date.slice(0, 10)}</time>
                      <button
                        onClick={() => editPost(post)}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-amber transition hover:border-amber"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmPost(post)}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#ff7b7b] transition hover:border-[#ff7b7b]"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 5. SETTINGS TAB ─── */}
            {tab === "settings" && (
              <form onSubmit={saveSettings} className="max-w-2xl">
                <h1 className="font-display text-3xl md:text-4xl italic font-bold text-white">Settings</h1>
                <div className="glass mt-8 grid gap-5 rounded-[8px] p-6 border border-white/10 bg-[#16161F]">
                  <label className="grid gap-2">
                    <span className="text-xs font-black text-muted uppercase tracking-wider">Site Name</span>
                    <input
                      value="Ghibli Gazette"
                      disabled
                      className="rounded-[8px] border border-white/10 bg-white/[0.02] px-4 py-3 text-muted text-sm"
                    />
                  </label>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs font-black text-muted uppercase tracking-wider mb-3">Change Password</p>
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={passwords.current}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, current: event.target.value }))
                        }
                        type="password"
                        className="rounded-[8px] border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm outline-none focus:border-amber"
                        placeholder="Current password"
                      />
                      <input
                        value={passwords.next}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, next: event.target.value }))
                        }
                        type="password"
                        className="rounded-[8px] border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm outline-none focus:border-amber"
                        placeholder="New password"
                      />
                      <input
                        value={passwords.confirm}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, confirm: event.target.value }))
                        }
                        type="password"
                        className="rounded-[8px] border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm outline-none focus:border-amber"
                        placeholder="Confirm new"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs font-black text-muted uppercase tracking-wider mb-3">Social Media Handles</p>
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        value={settings.instagram}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, instagram: event.target.value }))
                        }
                        className="rounded-[8px] border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm outline-none focus:border-amber"
                        placeholder="Instagram URL"
                      />
                      <input
                        value={settings.discord}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, discord: event.target.value }))
                        }
                        className="rounded-[8px] border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm outline-none focus:border-amber"
                        placeholder="Discord URL"
                      />
                      <input
                        value={settings.twitter}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, twitter: event.target.value }))
                        }
                        className="rounded-[8px] border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm outline-none focus:border-amber"
                        placeholder="𝕏 / Twitter URL"
                      />
                    </div>
                  </div>

                  {settingsMessage && <p className="font-bold text-sm text-amber">{settingsMessage}</p>}

                  <button className="btn btn-primary w-fit mt-2" type="submit">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmPost && (
          <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur">
            <div className="glass max-w-md rounded-[8px] p-6 text-center border border-white/10 bg-[#16161F]">
              <h2 className="font-display text-2xl italic font-bold text-white">Delete this story?</h2>
              <p className="mt-2 text-sm text-muted">{confirmPost.title}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setConfirmPost(null)} className="btn btn-outline text-xs">
                  Cancel
                </button>
                <button
                  onClick={deleteCurrentPost}
                  className="btn bg-[#d94848] text-white hover:bg-[#ff5555] text-xs"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PasswordGate>
  )
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black ${
        published ? "bg-[#2D9966]/20 text-[#7dffb2]" : "bg-white/10 text-muted"
      }`}
    >
      {published ? "Live" : "Draft"}
    </span>
  )
}
