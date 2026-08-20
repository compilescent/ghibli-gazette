import Link from "next/link"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MascotButton from "@/components/MascotButton"
import { getAllPosts, seedIfEmpty } from "@/lib/posts"
import { categoryLabel } from "@/lib/types"

export const metadata: Metadata = {
  title: "Story Archive",
  description: "Browse every anime and manga story published on Ghibli Gazette, newest first."
}

export default async function ArchivePage() {
  await seedIfEmpty()
  const posts = (await getAllPosts()).filter((p) => p.published)

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="shell" style={{ flex: 1, padding: "48px 0 80px" }}>
        <p
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "13px",
            letterSpacing: "0.2em",
            color: "var(--accent)",
            marginBottom: "8px"
          }}
        >
          FULL ARCHIVE
        </p>
        <h1
          style={{
            fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          Every Story, In Order
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "10px" }}>
          {posts.length} {posts.length === 1 ? "story" : "stories"} published · newest first
        </p>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "40px", display: "block", marginBottom: "12px" }}>📭</span>
            <p>No stories published yet. Check back soon.</p>
          </div>
        ) : (
          <div style={{ marginTop: "32px", overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-card)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                  {["Story", "Category", "Author", "Published", "Read"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 18px",
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)"
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const words = post.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
                  const rt = Math.max(1, Math.ceil(words / 200))
                  return (
                    <tr
                      key={post.id}
                      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <Link
                          href={`/blog/${post.id}`}
                          style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span className="badge" style={{ fontSize: "10px", padding: "2px 8px" }}>
                          {categoryLabel(post.category)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-secondary)" }}>
                        <Link href={`/author/${encodeURIComponent(post.author)}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {post.author}
                        </Link>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted)" }}>
                        {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.date))}
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "var(--text-muted)" }}>
                        {rt} min
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
      <MascotButton />
    </main>
  )
}