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
  coverColor: "#E8392A",
  coverImage: "",
  author: "Ghibli Gazette Staff",
  published: false,
  featured: false,
  tags: []
}

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
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Ghibli Gazette",
    tagline: "Your anime & manga news hub: reviews, releases, premieres, and industry intel.",
    instagram: "",
    discord: "",
    twitter: ""
  })
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [settingsMessage, setSettingsMessage] = useState("")
  const [crawling, setCrawling] = useState(false)
  const [postSearch, setPostSearch] = useState("")

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
      categories: new Set(posts.map((post) => post.category)).size,
      totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0)
    }),
    [posts, queue]
  )

  const filteredPosts = useMemo(() => {
    let base = posts
    if (filter === "published") base = base.filter((post) => post.published)
    if (filter === "drafts") base = base.filter((post) => !post.published)
    if (filter !== "all" && filter !== "published" && filter !== "drafts") {
      base = base.filter((post) => post.category === filter)
    }
    if (postSearch.trim()) {
      const q = postSearch.trim().toLowerCase()
      base = base.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    return base
  }, [filter, posts, postSearch])

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
      coverColor: story.coverColor || "#E8392A",
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
      <main style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
        {toast && (
          <div style={{ position: "fixed", left: "50%", top: "20px", transform: "translateX(-50%)", zIndex: 100, background: "var(--card)", border: "1px solid var(--red)", color: "var(--text)", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
            {toast}
          </div>
        )}

        <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
          {/* Sidebar Navigation */}
          <aside style={{ width: "220px", background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "22px", color: "var(--red)", letterSpacing: "0.03em" }}>GHIBLI</span>
                  <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "22px", color: "var(--text)", letterSpacing: "0.03em" }}>GAZETTE</span>
                </div>
                <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "10px", letterSpacing: "0.15em", color: "var(--text3)", textTransform: "uppercase", marginTop: "4px" }}>Staff Panel</p>
              </div>

              <nav style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 0 20px" }}>
                {[
                  ["dashboard", "📊 Dashboard", stats.total],
                  ["queue", "📥 News Queue", stats.queuePending],
                  ["new", "✦ Editor Desk", 0],
                  ["posts", "📝 All Posts", stats.total],
                  ["settings", "⚙️ Settings", 0]
                ].map(([id, label, count]) => {
                  const isActive = tab === id
                  return (
                    <button
                      key={id as string}
                      onClick={() => setTab(id as Tab)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 20px",
                        fontFamily: "var(--font-inter, system-ui, sans-serif)",
                        fontSize: "13px",
                        fontWeight: 500,
                        textAlign: "left",
                        cursor: "pointer",
                        border: "none",
                        borderLeft: isActive ? "3px solid var(--red)" : "3px solid transparent",
                        background: isActive ? "#1a0f0f" : "transparent",
                        color: isActive ? "var(--red)" : "var(--text2)",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.color = "var(--text)" } }}
                      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)" } }}
                    >
                      <span>{label as string}</span>
                      {Number(count) > 0 && (
                        <span style={{ background: "var(--red)", color: "#fff", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", padding: "1px 6px", borderRadius: "999px" }}>
                          {count as number}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div style={{ padding: "20px", borderTop: "1px solid var(--border)" }}>
              <button
                onClick={logout}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontFamily: "var(--font-inter, system-ui, sans-serif)",
                  fontSize: "13px",
                  color: "var(--red)",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--card)"; e.currentTarget.style.borderColor = "var(--red)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)" }}
              >
                Log Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section style={{ flex: 1, background: "var(--bg)", padding: "24px", overflowY: "auto" }}>
            {/* ─── 1. DASHBOARD TAB ─── */}
            {tab === "dashboard" && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
                  <h1 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "32px", letterSpacing: "0.06em", color: "var(--text)" }}>EDITORIAL DASHBOARD</h1>
                  <button
                    onClick={handleCrawlNews}
                    disabled={crawling}
                    style={{
                      background: "var(--red)",
                      color: "#fff",
                      fontFamily: "var(--font-inter, system-ui, sans-serif)",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: crawling ? "not-allowed" : "pointer",
                      opacity: crawling ? 0.6 : 1
                    }}
                  >
                    {crawling ? "📡 Scanning..." : "🔄 Crawl & Fetch News"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                  {[
                    ["Live Published Stories", stats.published],
                    ["Pending Review Queue", stats.queuePending],
                    ["Unpublished Drafts", stats.drafts],
                    ["Total Page Views", stats.totalViews]
                  ].map(([label, value]) => (
                    <div key={label as string} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "20px" }}>
                      <p style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "36px", color: "var(--red)", lineHeight: 1 }}>{value as number}</p>
                      <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--text3)", marginTop: "8px" }}>{label as string}</p>
                    </div>
                  ))}
                </div>

                {/* Most Read Stories */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden", marginBottom: "24px" }}>
                  <div style={{ borderBottom: "1px solid var(--border)", padding: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🔥</span>
                    <h2 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "16px", letterSpacing: "0.08em", color: "var(--text)" }}>MOST READ STORIES</h2>
                  </div>
                  <div>
                    {[...posts]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((post, i) => (
                        <div key={post.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                          <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "24px", color: "var(--text3)", minWidth: "32px" }}>{String(i + 1).padStart(2, "0")}</span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</p>
                            <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--text3)" }}>{categoryLabel(post.category)}</p>
                          </div>
                          <span style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 10px", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", color: "var(--red)" }}>
                            {post.views} views
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quick Queue Alert */}
                {stats.queuePending > 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", background: "rgba(232,57,42,0.08)", border: "1px solid var(--red)", borderRadius: "6px", padding: "16px" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                        ✦ You have {stats.queuePending} AI-crawled stories awaiting editorial review!
                      </p>
                      <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--text3)", marginTop: "4px" }}>
                        Sources: Anime News Network, MyAnimeList, CBR, Kotaku, Sportskeeda.
                      </p>
                    </div>
                    <button onClick={() => setTab("queue")} style={{ background: "var(--red)", color: "#fff", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "13px", letterSpacing: "0.08em", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                      Open Review Queue →
                    </button>
                  </div>
                )}

                {/* Recent Posts Table */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden", marginTop: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border)", background: "var(--bg3)" }}>
                    <h2 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "14px", letterSpacing: "0.08em", color: "var(--text3)" }}>RECENT PUBLISHED STORIES</h2>
                    <button onClick={() => setTab("posts")} style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}>
                      View All ({posts.length}) →
                    </button>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", minWidth: "720px", textAlign: "left", fontSize: "13px", borderCollapse: "collapse" }}>
                      <thead style={{ background: "var(--bg3)" }}>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          <th style={{ padding: "12px 16px", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)", fontWeight: 400 }}>TITLE</th>
                          <th style={{ padding: "12px 16px", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)", fontWeight: 400 }}>CATEGORY</th>
                          <th style={{ padding: "12px 16px", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)", fontWeight: 400 }}>STATUS</th>
                          <th style={{ padding: "12px 16px", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)", fontWeight: 400 }}>DATE</th>
                          <th style={{ padding: "12px 16px", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)", fontWeight: 400 }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.slice(0, 6).map((post) => (
                          <tr key={post.id} style={{ borderBottom: "1px solid #1A1A24" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text)", maxWidth: "320px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "10px", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "3px", background: "var(--text3)", color: "#fff" }}>
                                {categoryLabel(post.category).toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <StatusBadge published={post.published} />
                            </td>
                            <td style={{ padding: "12px 16px", color: "var(--text3)", fontSize: "12px" }}>{post.date.slice(0, 10)}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <button onClick={() => editPost(post)} style={{ color: "var(--blue)", fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
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
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <h1 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "28px", letterSpacing: "0.06em", color: "var(--text)" }}>AI NEWS REVIEW QUEUE</h1>
                    <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", color: "var(--text3)", marginTop: "4px" }}>
                      Crawled, deduplicated, and formatted by the Ghibli Gazette AI agent. Review and publish with 1 click.
                    </p>
                  </div>
                  <button
                    onClick={handleCrawlNews}
                    disabled={crawling}
                    style={{
                      background: "var(--red)",
                      color: "#fff",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                      fontSize: "13px",
                      letterSpacing: "0.06em",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: crawling ? "not-allowed" : "pointer",
                      opacity: crawling ? 0.6 : 1
                    }}
                  >
                    {crawling ? "📡 Crawling..." : "🔄 Crawl & Fetch News"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  {(["pending", "approved", "all"] as QueueFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setQueueFilter(f)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        fontFamily: "var(--font-inter, system-ui, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: queueFilter === f ? "1px solid var(--red)" : "1px solid var(--border)",
                        background: queueFilter === f ? "var(--red)" : "transparent",
                        color: queueFilter === f ? "#fff" : "var(--text3)",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {f === "pending"
                        ? `Pending (${queue.filter((q) => q.status === "pending").length})`
                        : f === "approved"
                        ? `Approved (${queue.filter((q) => q.status === "approved").length})`
                        : `All (${queue.length})`}
                    </button>
                  ))}
                </div>

                {filteredQueue.length === 0 ? (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "40px", textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "20px", color: "var(--text)", letterSpacing: "0.06em" }}>No stories in this queue</p>
                    <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", color: "var(--text3)", marginTop: "8px" }}>
                      Click the "Crawl & Fetch News" button above to scan top anime outlets and generate ready-to-publish drafts.
                    </p>
                    <button
                      onClick={handleCrawlNews}
                      disabled={crawling}
                      style={{ marginTop: "16px", background: "var(--red)", color: "#fff", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "13px", letterSpacing: "0.06em", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                    >
                      {crawling ? "Scanning Feeds..." : "Scan & Fetch News Now"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "12px" }}>
                    {filteredQueue.map((story) => (
                      <article
                        key={story.id}
                        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "16px", transition: "border-color 0.15s ease" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "140px 1fr auto" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ position: "relative", height: "96px", width: "100%", overflow: "hidden", borderRadius: "6px", background: "var(--bg3)" }}>
                              <img
                                src={story.coverImage || getPostCoverImage(story)}
                                alt={story.title}
                                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                              />
                              <span style={{ position: "absolute", bottom: "4px", right: "4px", background: "rgba(0,0,0,0.8)", color: "var(--gold)", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "10px", padding: "2px 6px", borderRadius: "3px" }}>
                                ✓ {story.confidenceScore}% Match
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => cycleStoryImage(story)}
                              style={{ background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text3)", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "11px", letterSpacing: "0.06em", padding: "4px", borderRadius: "4px", cursor: "pointer" }}
                            >
                              ⚡ Change Visual
                            </button>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "11px", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "3px", background: "var(--blue)", color: "#fff" }}>
                                  {categoryLabel(story.category).toUpperCase()}
                                </span>
                                <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--text3)" }}>
                                  Source: <strong style={{ color: "var(--text)" }}>{story.sourceName}</strong>
                                </span>
                                {story.sourceUrl && (
                                  <a
                                    href={story.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--red)", textDecoration: "underline" }}
                                  >
                                    [Original Link ↗]
                                  </a>
                                )}
                              </div>

                              <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "15px", fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>
                                {story.title}
                              </h3>

                              <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--text3)", lineHeight: 1.5, marginTop: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{story.excerpt}</p>
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                              {story.tags.map((t) => (
                                <span
                                  key={t}
                                  style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: "999px", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "11px", color: "var(--text3)" }}
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", minWidth: "140px" }}>
                            {story.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveStory(story)}
                                  style={{ background: "var(--red)", color: "#fff", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "13px", letterSpacing: "0.06em", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", transition: "background 0.15s ease" }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--red2)"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--red)"}
                                >
                                  🚀 Approve & Publish
                                </button>
                                <button
                                  onClick={() => handleEditQueuedInDesk(story)}
                                  style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
                                >
                                  ✏️ Polish in Desk
                                </button>
                                <button
                                  onClick={() => handleDismissStory(story.id)}
                                  style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--red)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
                                >
                                  ✕ Dismiss
                                </button>
                              </>
                            ) : (
                              <span style={{ background: "#0f2a1a", color: "#2ECC71", border: "1px solid #2ECC7144", padding: "6px 12px", borderRadius: "999px", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
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
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <h1 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "28px", letterSpacing: "0.06em", color: "var(--text)" }}>
                      {editingId ? "EDIT STORY" : "EDITORIAL DESK"}
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", color: "var(--text3)", marginTop: "4px" }}>Write, format, and publish articles.</p>
                  </div>
                  {editingId && (
                    <button onClick={resetForm} style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
                      Start New Story
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gap: "20px", maxWidth: "720px" }}>
                  {/* Headline */}
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)", marginBottom: "6px" }}>
                      Headline
                    </label>
                    <input
                      value={draft.title ?? ""}
                      onChange={(event) => updateDraft("title", event.target.value)}
                      placeholder="Enter a compelling story title..."
                      style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px 14px", color: "var(--text)", fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "20px", fontStyle: "italic", fontWeight: 700, outline: "none" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>

                  {/* Excerpt */}
                  <label style={{ display: "grid", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Excerpt / Teaser</span>
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: (draft.excerpt?.length ?? 0) > 180 ? "var(--red)" : "var(--red)" }}>
                        {draft.excerpt?.length ?? 0}/180
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={draft.excerpt ?? ""}
                      onChange={(event) => updateDraft("excerpt", event.target.value.slice(0, 180))}
                      placeholder="A short, engaging two-sentence summary..."
                      style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "14px", outline: "none", resize: "vertical" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </label>

                  {/* Category & Tags */}
                  <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Category</span>
                      <select
                        value={draft.category ?? "general"}
                        onChange={(event) => updateDraft("category", event.target.value as Category)}
                        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "14px", outline: "none" }}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Tags (comma separated)</span>
                      <input
                        value={tagsText}
                        onChange={(event) =>
                          updateDraft(
                            "tags",
                            event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                          )
                        }
                        placeholder="Studio Ghibli, Miyazaki, Review"
                        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "14px", outline: "none" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      />
                    </label>
                  </div>

                  {/* Cover Image URL */}
                  <label style={{ display: "grid", gap: "6px" }}>
                    <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Cover Image URL (optional)</span>
                    <input
                      value={draft.coverImage ?? ""}
                      onChange={(event) => updateDraft("coverImage", event.target.value)}
                      placeholder="https://images.unsplash.com/... or leave blank for auto-matching"
                      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "monospace", fontSize: "12px", outline: "none" }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </label>

                  {/* Published Toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                    <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Published</span>
                    <button
                      type="button"
                      onClick={() => updateDraft("published", !draft.published)}
                      style={{
                        width: "44px",
                        height: "24px",
                        borderRadius: "999px",
                        background: draft.published ? "var(--red)" : "var(--border2)",
                        border: "none",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background 0.2s ease"
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "2px",
                        left: draft.published ? "22px" : "2px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.2s ease",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
                      }} />
                    </button>
                    <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: draft.published ? "var(--green)" : "var(--text3)" }}>{draft.published ? "Live" : "Draft"}</span>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                      <input type="checkbox" checked={!!draft.featured} onChange={(e) => updateDraft("featured", e.target.checked)} style={{ accentColor: "var(--red)" }} />
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--text2)" }}>Featured</span>
                    </label>
                  </div>

                  {/* Rich Text Editor Toolbar */}
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "16px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
                        {[
                          ["Bold", "<strong>", "</strong>"],
                          ["Italic", "<em>", "</em>"],
                          ["H2", "<h2>", "</h2>"],
                          ["Quote", "<blockquote>", "</blockquote>"],
                          ["Link", '<a href="https://..." target="_blank">', "</a>"],
                          ["Paragraph", "<p>", "</p>"]
                        ].map(([label, open, close]) => (
                          <button
                            key={label as string}
                            type="button"
                            onClick={() => insertFormat(open as string, close as string)}
                            style={{ background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}
                          >
                            {label as string}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setView("edit")}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontFamily: "var(--font-inter, system-ui, sans-serif)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "none",
                            background: view === "edit" ? "var(--red)" : "transparent",
                            color: view === "edit" ? "#fff" : "var(--text3)"
                          }}
                        >
                          Code Editor
                        </button>
                        <button
                          type="button"
                          onClick={() => setView("preview")}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontFamily: "var(--font-inter, system-ui, sans-serif)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "none",
                            background: view === "preview" ? "var(--red)" : "transparent",
                            color: view === "preview" ? "#fff" : "var(--text3)"
                          }}
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
                        placeholder="Write your HTML content here..."
                        style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", fontFamily: "monospace", fontSize: "14px", lineHeight: 1.7, color: "var(--text)", outline: "none", minHeight: "320px" }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      />
                    ) : (
                      <div
                        className="prose-article"
                        style={{ minHeight: "320px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "16px" }}
                        dangerouslySetInnerHTML={{ __html: draft.content ?? "" }}
                      />
                    )}
                  </div>

                  {/* Publish & Draft Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        type="button"
                        onClick={() => savePost(false)}
                        style={{ flex: 1, background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "14px", fontWeight: 600, padding: "12px", borderRadius: "6px", cursor: "pointer" }}
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => savePost(true)}
                        style={{ flex: 1, background: "var(--red)", color: "#fff", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "16px", letterSpacing: "0.1em", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", transition: "background 0.15s ease" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--red2)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--red)"}
                      >
                        Publish to Live Site ✦
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 4. ALL POSTS TAB ─── */}
            {tab === "posts" && (
              <div>
                <h1 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "28px", letterSpacing: "0.06em", color: "var(--text)", marginBottom: "16px" }}>ALL STORIES</h1>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
                  {["all", "published", "drafts", ...categories.map((category) => category.id)].map((id) => (
                    <button
                      key={id}
                      onClick={() => setFilter(id as PostFilter)}
                      style={{
                        flexShrink: 0,
                        padding: "6px 14px",
                        borderRadius: "999px",
                        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        border: filter === id ? "1px solid var(--red)" : "1px solid var(--border)",
                        background: filter === id ? "var(--red)" : "transparent",
                        color: filter === id ? "#fff" : "var(--text3)",
                        transition: "all 0.15s ease"
                      }}
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

                <input
                  value={postSearch}
                  onChange={(event) => setPostSearch(event.target.value)}
                  placeholder="🔍 Search by title, excerpt, or tag..."
                  style={{ width: "100%", maxWidth: "400px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", outline: "none", marginBottom: "16px" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />

                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 100px 80px 100px 60px 60px 60px", gap: "0", padding: "12px 16px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)" }}>TITLE</span>
                    <span />
                    <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)" }}>CATEGORY</span>
                    <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)" }}>STATUS</span>
                    <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)" }}>DATE</span>
                    <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "12px", letterSpacing: "0.1em", color: "var(--text3)" }}>VIEWS</span>
                    <span />
                    <span />
                  </div>
                  {filteredPosts.length === 0 ? (
                    <p style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", color: "var(--text3)" }}>No stories match your filters or search.</p>
                  ) : (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        style={{ display: "grid", gridTemplateColumns: "auto 1fr 100px 80px 100px 60px 60px 60px", gap: "0", padding: "12px 16px", borderBottom: "1px solid #1A1A24", alignItems: "center", transition: "background 0.15s ease" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ height: "12px", width: "12px", borderRadius: "50%", background: post.coverColor || "var(--red)", display: "inline-block" }} />
                        <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 12px" }}>{post.title}</p>
                        <span
                          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "10px", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: "3px", background: "var(--border2)", color: "#fff", textAlign: "center" }}
                        >
                          {categoryLabel(post.category).toUpperCase()}
                        </span>
                        <StatusBadge published={post.published} />
                        <time style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--text3)" }}>{post.date.slice(0, 10)}</time>
                        <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--red)" }}>{post.views}</span>
                        <button
                          onClick={() => editPost(post)}
                          style={{ color: "var(--blue)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmPost(post)}
                          style={{ color: "var(--red)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ─── 5. SETTINGS TAB ─── */}
            {tab === "settings" && (
              <form onSubmit={saveSettings} style={{ maxWidth: "640px" }}>
                <h1 style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "28px", letterSpacing: "0.06em", color: "var(--text)", marginBottom: "24px" }}>SETTINGS</h1>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "24px", display: "grid", gap: "20px" }}>
                  <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Site Name</span>
                      <input
                        value={settings.siteName}
                        onChange={(event) => setSettings((current) => ({ ...current, siteName: event.target.value }))}
                        placeholder="Ghibli Gazette"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "14px", outline: "none" }}
                      />
                    </label>
                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)" }}>Tagline</span>
                      <input
                        value={settings.tagline}
                        onChange={(event) => setSettings((current) => ({ ...current, tagline: event.target.value }))}
                        placeholder="Your anime & manga news hub..."
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "14px", outline: "none" }}
                      />
                    </label>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                    <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)", marginBottom: "12px" }}>Change Password</p>
                    <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr 1fr" }}>
                      <input
                        value={passwords.current}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, current: event.target.value }))
                        }
                        type="password"
                        placeholder="Current password"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                      <input
                        value={passwords.next}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, next: event.target.value }))
                        }
                        type="password"
                        placeholder="New password"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                      <input
                        value={passwords.confirm}
                        onChange={(event) =>
                          setPasswords((current) => ({ ...current, confirm: event.target.value }))
                        }
                        type="password"
                        placeholder="Confirm new"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                    <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text2)", marginBottom: "12px" }}>Social Media Handles</p>
                    <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr 1fr" }}>
                      <input
                        value={settings.instagram}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, instagram: event.target.value }))
                        }
                        placeholder="Instagram URL"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                      <input
                        value={settings.discord}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, discord: event.target.value }))
                        }
                        placeholder="Discord URL"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                      <input
                        value={settings.twitter}
                        onChange={(event) =>
                          setSettings((current) => ({ ...current, twitter: event.target.value }))
                        }
                        placeholder="𝕏 / Twitter URL"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  </div>

                  {settingsMessage && <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", fontWeight: 600, color: "var(--red)" }}>{settingsMessage}</p>}

                  <button type="submit" style={{ width: "fit-content", background: "var(--red)", color: "#fff", fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "14px", letterSpacing: "0.08em", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmPost && (
          <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.7)", padding: "16px", backdropFilter: "blur(4px)" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", textAlign: "center", maxWidth: "400px", width: "100%" }}>
              <h2 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>Delete this story?</h2>
              <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", color: "var(--text3)", marginTop: "8px" }}>{confirmPost.title}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
                <button onClick={() => setConfirmPost(null)} style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button
                  onClick={deleteCurrentPost}
                  style={{ background: "var(--red)", color: "#fff", fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "999px",
        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
        fontSize: "10px",
        letterSpacing: "0.08em",
        border: published ? "1px solid #2ECC7144" : "1px solid #333344",
        background: published ? "#0f2a1a" : "#1a1a1a",
        color: published ? "#2ECC71" : "#5A5868"
      }}
    >
      {published ? "Live" : "Draft"}
    </span>
  )
}