import Link from "next/link"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PostCard from "@/components/PostCard"
import { getAllPosts, seedIfEmpty } from "@/lib/posts"
import { categoryLabel, getPostCoverImage, isCategory } from "@/lib/types"

export const dynamic = "force-dynamic"

const catImages: Record<string, string> = {
  "ghibli-news": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1400&auto=format&fit=crop",
  "new-release": "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1400&auto=format&fit=crop",
  "review": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop",
  "premiere": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400&auto=format&fit=crop",
  "general": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1400&auto=format&fit=crop"
}

export default async function CategoryPage({ params }: { params: { cat: string } }) {
  if (!isCategory(params.cat)) notFound()
  await seedIfEmpty()
  const posts = (await getAllPosts()).filter((p) => p.published && p.category === params.cat)
  const heroImage = catImages[params.cat] || catImages["general"]

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Category Hero Banner with Real Image */}
      <section
        style={{
          width: "100%",
          height: "300px",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--bg-elevated)"
        }}
      >
        <img
          src={heroImage}
          alt={categoryLabel(params.cat)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10, 10, 15, 0.3) 0%, rgba(10, 10, 15, 0.8) 70%, rgba(10, 10, 15, 0.98) 100%)"
          }}
        />
        <div className="shell" style={{ position: "relative", zIndex: 2, paddingBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
              fontSize: "12px",
              color: "rgba(240, 238, 232, 0.65)",
              fontFamily: "var(--font-inter, system-ui, sans-serif)"
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "var(--accent)" }}>{categoryLabel(params.cat)}</span>
          </div>

          <p
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "var(--accent)",
              marginBottom: "8px"
            }}
          >
            CATEGORY ARCHIVE
          </p>

          <h1
            style={{
              fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: "#fff",
              margin: 0
            }}
          >
            {categoryLabel(params.cat)}
          </h1>

          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "10px", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
            {posts.length} {posts.length === 1 ? "story published" : "stories published"}
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section style={{ padding: "40px 0 80px", flex: 1 }}>
        <div className="shell">
          {posts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px"
              }}
            >
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                maxWidth: "500px",
                margin: "0 auto"
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                  fontSize: "20px",
                  color: "#fff",
                  marginBottom: "12px"
                }}
              >
                No stories in this category yet
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                Check back soon for new articles and coverage.
              </p>
              <Link href="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
