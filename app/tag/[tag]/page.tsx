import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PostCard from "@/components/PostCard"
import MascotButton from "@/components/MascotButton"
import { getAllPosts, seedIfEmpty } from "@/lib/posts"

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `#${tag} stories`,
    description: `All stories tagged #${tag} on Ghibli Gazette — anime & manga news hub.`
  }
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  await seedIfEmpty()
  const posts = (await getAllPosts()).filter(
    (p) => p.published && p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  )

  if (posts.length === 0) notFound()

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
          TAG ARCHIVE
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
          #{tag}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "10px" }}>
          {posts.length} {posts.length === 1 ? "story" : "stories"} tagged with #{tag}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            marginTop: "32px"
          }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/archive" className="btn btn-outline" style={{ display: "inline-flex" }}>
            ← Browse Full Archive
          </Link>
        </div>
      </div>
      <Footer />
      <MascotButton />
    </main>
  )
}