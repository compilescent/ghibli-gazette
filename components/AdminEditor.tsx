"use client"

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react"
import PasswordGate from "./PasswordGate"
import { categories, categoryGradient, categoryLabel, type Category, type Post, type SiteSettings } from "@/lib/types"

type Tab = "dashboard" | "new" | "posts" | "settings"
type PostFilter = "all" | "published" | "drafts" | Category

const emptyPost: Partial<Post> = {
  title: "",
  excerpt: "",
  content: "<p>Begin your story here...</p>",
  category: "general",
  coverColor: "#E8643A",
  author: "Ghibli Gazette",
  published: false,
  tags: []
}

const swatches = ["#667eea", "#F4A261", "#43b89c", "#f093fb", "#4facfe"]

export default function AdminEditor() {
  const [tab, setTab] = useState<Tab>("dashboard")
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState<Partial<Post>>(emptyPost)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [view, setView] = useState<"edit" | "preview">("edit")
  const [filter, setFilter] = useState<PostFilter>("all")
  const [toast, setToast] = useState("")
  const [confirmPost, setConfirmPost] = useState<Post | null>(null)
  const [settings, setSettings] = useState<SiteSettings>({ instagram: "", discord: "", twitter: "" })
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [settingsMessage, setSettingsMessage] = useState("")

  async function loadPosts() {
    const response = await fetch("/api/posts")
    const data = (await response.json()) as Post[]
    setPosts(data)
  }

  async function loadSettings() {
    const response = await fetch("/api/auth")
    const data = (await response.json()) as { settings: SiteSettings }
    setSettings(data.settings)
  }

  useEffect(() => {
    loadPosts()
    loadSettings()
  }, [])

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.published).length,
      drafts: posts.filter((post) => !post.published).length,
      categories: new Set(posts.map((post) => post.category)).size
    }),
    [posts]
  )

  const filteredPosts = useMemo(() => {
    if (filter === "published") return posts.filter((post) => post.published)
    if (filter === "drafts") return posts.filter((post) => !post.published)
    if (filter === "all") return posts
    return posts.filter((post) => post.category === filter)
  }, [filter, posts])

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
      excerpt: (draft.excerpt ?? "").slice(0, 150),
      tags: draft.tags ?? [],
      author: draft.author || "Ghibli Gazette"
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
    setToast(published ? "Your story is live! ✦" : "Draft saved ✦")
    window.setTimeout(() => setToast(""), 2400)
    if (!editingId) resetForm()
  }

  function handleTab(event: KeyboardEvent<HTMLTextAreaElement>) {
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
    setSettingsMessage("Settings saved")
  }

  function logout() {
    sessionStorage.removeItem("gz_auth")
    window.location.reload()
  }

  return (
    <PasswordGate>
      <main className="min-h-screen bg-[radial-gradient(circle_at_80%_10%,rgba(244,162,97,0.12),transparent_28rem),#07111f] text-cream">
        {toast && <div className="toast fixed left-1/2 top-5 z-[100] rounded-full border border-amber/40 bg-[#0D1B2A]/92 px-5 py-3 text-sm font-black text-amber shadow-glow">{toast}</div>}

        <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
          <aside className="border-b border-white/10 bg-[#0D1B2A]/82 p-4 backdrop-blur md:border-b-0 md:border-r md:p-6">
            <div className="flex items-center justify-between gap-3 md:block">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber to-gold font-display text-2xl italic text-[#111827]">
                GG
              </div>
              <button onClick={logout} className="rounded-full border border-white/10 px-4 py-2 text-sm font-extrabold text-muted transition hover:border-amber hover:text-amber md:hidden">
                Logout
              </button>
            </div>
            <nav className="mt-5 flex gap-2 overflow-x-auto md:grid md:gap-2">
              {[
                ["dashboard", "📊 Dashboard"],
                ["new", "✦ New Post"],
                ["posts", "📝 All Posts"],
                ["settings", "⚙️ Settings"]
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id as Tab)}
                  className={`shrink-0 rounded-[8px] border-l-4 px-4 py-3 text-left text-sm font-black transition ${
                    tab === id ? "border-amber bg-white/[0.06] text-amber" : "border-transparent text-muted hover:bg-white/[0.04] hover:text-cream"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="relative mt-12 hidden h-28 md:block">
              <div className="lantern !bottom-auto !left-1/2 !top-8 scale-75" />
            </div>
            <button onClick={logout} className="btn btn-outline mt-auto hidden w-full md:inline-flex">
              Logout
            </button>
          </aside>

          <section className="p-4 pb-28 md:p-8">
            {tab === "dashboard" && (
              <div>
                <h1 className="font-display text-4xl italic text-white">Dashboard</h1>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Total Posts", stats.total],
                    ["Published", stats.published],
                    ["Drafts", stats.drafts],
                    ["Categories", stats.categories]
                  ].map(([label, value]) => (
                    <div key={label} className="glass rounded-[8px] p-5">
                      <p className="text-4xl font-black text-amber">{value}</p>
                      <p className="mt-2 text-sm font-bold text-muted">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="glass mt-8 overflow-hidden rounded-[8px]">
                  <div className="border-b border-white/10 p-5">
                    <h2 className="font-display text-2xl italic text-white">Recent Posts</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="text-muted">
                        <tr>
                          <th className="p-4">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Edit</th>
                          <th className="p-4">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.slice(0, 5).map((post) => (
                          <tr key={post.id} className="border-t border-white/8">
                            <td className="p-4 font-bold text-white">{post.title}</td>
                            <td className="p-4 text-muted">{categoryLabel(post.category)}</td>
                            <td className="p-4"><StatusBadge published={post.published} /></td>
                            <td className="p-4 text-muted">{post.date.slice(0, 10)}</td>
                            <td className="p-4"><button onClick={() => editPost(post)} className="text-amber">Edit</button></td>
                            <td className="p-4"><button onClick={() => setConfirmPost(post)} className="text-[#ff7b7b]">Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {tab === "new" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="font-display text-4xl italic text-white">{editingId ? "Edit Story" : "New Story"}</h1>
                  {editingId && <button onClick={resetForm} className="btn btn-outline min-h-0 px-4 py-2 text-sm">Start New</button>}
                </div>

                <div className="mt-8 grid gap-5">
                  <input
                    value={draft.title ?? ""}
                    onChange={(event) => updateDraft("title", event.target.value)}
                    className="w-full rounded-[8px] border border-white/10 bg-white/[0.04] px-5 py-4 font-display text-3xl italic text-white outline-none transition placeholder:text-muted focus:border-amber"
                    placeholder="Story title..."
                  />
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-muted">Excerpt <span className={(draft.excerpt?.length ?? 0) > 150 ? "text-[#ff7b7b]" : "text-amber"}>{draft.excerpt?.length ?? 0}/150</span></span>
                    <textarea
                      rows={3}
                      value={draft.excerpt ?? ""}
                      onChange={(event) => updateDraft("excerpt", event.target.value.slice(0, 150))}
                      className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-cream outline-none transition placeholder:text-muted focus:border-amber"
                      placeholder="A short summary..."
                    />
                  </label>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-muted">Category</span>
                      <select
                        value={draft.category ?? "general"}
                        onChange={(event) => updateDraft("category", event.target.value as Category)}
                        className="rounded-[8px] border border-white/10 bg-[#0D1B2A] px-4 py-3 text-cream outline-none focus:border-amber"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-muted">Tags</span>
                      <input
                        value={tagsText}
                        onChange={(event) => updateDraft("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
                        className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-cream outline-none focus:border-amber"
                        placeholder="Ghibli, Miyazaki, Review"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(draft.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-black text-amber">{tag}</span>)}
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-muted">Cover Color</span>
                      <div className="flex items-center gap-3">
                        <input type="color" value={draft.coverColor ?? "#F4A261"} onChange={(event) => updateDraft("coverColor", event.target.value)} className="h-12 w-16 rounded border-0 bg-transparent" />
                        {swatches.map((color) => (
                          <button key={color} type="button" onClick={() => updateDraft("coverColor", color)} className="h-9 w-9 rounded-full border border-white/20" style={{ background: color }} aria-label={`Use ${color}`} />
                        ))}
                      </div>
                    </label>
                    <label className="flex items-center justify-between rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
                      <span className="font-black text-muted">{draft.published ? "Live" : "Draft"}</span>
                      <button
                        type="button"
                        onClick={() => updateDraft("published", !draft.published)}
                        className={`relative h-8 w-16 rounded-full transition ${draft.published ? "bg-amber" : "bg-dim"}`}
                      >
                        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${draft.published ? "left-9" : "left-1"}`} />
                      </button>
                    </label>
                  </div>

                  <div className="glass rounded-[8px] p-4">
                    <div className="mb-3 flex justify-end gap-2">
                      <button onClick={() => setView("edit")} className={`rounded-full px-4 py-2 text-sm font-black ${view === "edit" ? "bg-amber text-[#111827]" : "text-muted"}`}>Edit</button>
                      <button onClick={() => setView("preview")} className={`rounded-full px-4 py-2 text-sm font-black ${view === "preview" ? "bg-amber text-[#111827]" : "text-muted"}`}>Preview</button>
                    </div>
                    {view === "edit" ? (
                      <textarea
                        rows={20}
                        value={draft.content ?? ""}
                        onKeyDown={handleTab}
                        onChange={(event) => updateDraft("content", event.target.value)}
                        className="w-full rounded-[8px] border border-white/10 bg-[#07111f] p-4 font-mono text-sm leading-7 text-cream outline-none focus:border-amber"
                      />
                    ) : (
                      <div className="prose-ghibli min-h-[420px] rounded-[8px] border border-white/10 bg-[#07111f] p-5" dangerouslySetInnerHTML={{ __html: draft.content ?? "" }} />
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={() => savePost(false)} className="btn btn-outline">Save Draft</button>
                    <button onClick={() => savePost(true)} className="btn btn-primary">Publish Story ✦</button>
                  </div>
                </div>
              </div>
            )}

            {tab === "posts" && (
              <div>
                <h1 className="font-display text-4xl italic text-white">All Posts</h1>
                <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                  {["all", "published", "drafts", ...categories.map((category) => category.id)].map((id) => (
                    <button key={id} onClick={() => setFilter(id as PostFilter)} className={`shrink-0 rounded-full border border-amber px-4 py-2 text-sm font-black ${filter === id ? "bg-amber text-white" : "text-muted"}`}>
                      {id === "all" ? "All" : id === "published" ? "Published" : id === "drafts" ? "Drafts" : categoryLabel(id as Category)}
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid gap-3">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="glass grid gap-3 rounded-[8px] p-4 md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto] md:items-center">
                      <span className="h-4 w-4 rounded-full" style={{ background: post.coverColor }} />
                      <p className="truncate font-black text-white">{post.title}</p>
                      <span className="w-fit rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: categoryGradient(post.category) }}>{categoryLabel(post.category)}</span>
                      <StatusBadge published={post.published} />
                      <time className="text-sm font-bold text-muted">{post.date.slice(0, 10)}</time>
                      <button onClick={() => editPost(post)} className="rounded-full border border-white/10 px-3 py-2 text-amber transition hover:border-amber">✎</button>
                      <button onClick={() => setConfirmPost(post)} className="rounded-full border border-white/10 px-3 py-2 text-[#ff7b7b] transition hover:border-[#ff7b7b]">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "settings" && (
              <form onSubmit={saveSettings} className="max-w-3xl">
                <h1 className="font-display text-4xl italic text-white">Settings</h1>
                <div className="glass mt-8 grid gap-5 rounded-[8px] p-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-muted">Site Name</span>
                    <input value="Ghibli Gazette" disabled className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 text-muted" />
                  </label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <input value={passwords.current} onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} type="password" className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-amber" placeholder="Current password" />
                    <input value={passwords.next} onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} type="password" className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-amber" placeholder="New password" />
                    <input value={passwords.confirm} onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))} type="password" className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-amber" placeholder="Confirm" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <input value={settings.instagram} onChange={(event) => setSettings((current) => ({ ...current, instagram: event.target.value }))} className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-amber" placeholder="Instagram URL" />
                    <input value={settings.discord} onChange={(event) => setSettings((current) => ({ ...current, discord: event.target.value }))} className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-amber" placeholder="Discord URL" />
                    <input value={settings.twitter} onChange={(event) => setSettings((current) => ({ ...current, twitter: event.target.value }))} className="rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-amber" placeholder="Twitter URL" />
                  </div>
                  {settingsMessage && <p className="font-black text-amber">{settingsMessage}</p>}
                  <button className="btn btn-primary w-fit" type="submit">Save Changes</button>
                </div>
              </form>
            )}
          </section>
        </div>

        {confirmPost && (
          <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4 backdrop-blur">
            <div className="glass max-w-md rounded-[8px] p-6 text-center">
              <h2 className="font-display text-3xl italic text-white">Delete this story?</h2>
              <p className="mt-3 font-bold text-muted">{confirmPost.title}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setConfirmPost(null)} className="btn btn-outline">Cancel</button>
                <button onClick={deleteCurrentPost} className="btn danger-delete bg-[#d94848] text-white">Delete Forever</button>
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
    <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${published ? "bg-[#2fbf71]/18 text-[#7dffb2]" : "bg-white/8 text-muted"}`}>
      {published ? "Live" : "Draft"}
    </span>
  )
}
