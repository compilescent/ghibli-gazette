import Link from "next/link"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PostCard from "@/components/PostCard"
import ShareButtons from "@/components/ShareButtons"
import QuickBriefing from "@/components/QuickBriefing"
import MangaPanelLightbox from "@/components/MangaPanelLightbox"
import ImageWithFallback from "@/components/ImageWithFallback"
import MascotButton from "@/components/MascotButton"
import ReaderFontToggle from "@/components/ReaderFontToggle"
import { ReadingProgress } from "@/components/ReadingProgress"
import { TableOfContents } from "@/components/TableOfContents"
import { getAllPosts, getPostBySlug, seedIfEmpty, updatePost } from "@/lib/posts"
import { categoryLabel, getPostCoverImage } from "@/lib/types"

export const revalidate = 3600

function readTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    "ghibli-news": "linear-gradient(135deg, #1a1535, #2d1b69)",
    "new-release": "linear-gradient(135deg, #1a0a0a, #4a0f0f)",
    "review": "linear-gradient(135deg, #0a1a0f, #0f3d1f)",
    "premiere": "linear-gradient(135deg, #1a0a1a, #4a0f4a)",
    "general": "linear-gradient(135deg, #0a0f1a, #0f204a)",
    "anime-news": "linear-gradient(135deg, #1a100a, #4a2a0f)",
    "manga-news": "linear-gradient(135deg, #150a1a, #3a0f4a)",
    "industry": "linear-gradient(135deg, #0a1a18, #0f3a35)",
  }
  return gradients[category] || gradients["general"]
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "ghibli-news": "#667eea",
    "new-release": "#E8392A",
    "review": "#2ECC71",
    "premiere": "#C94FAE",
    "general": "#4A8FE8",
    "anime-news": "#FF6B35",
    "manga-news": "#9B59B6",
    "industry": "#1ABC9C",
  }
  return colors[category] || colors["general"]
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await seedIfEmpty()
  const post = await getPostBySlug(params.slug)
  if (!post || !post.published) notFound()

  await updatePost(post.id, { views: (post.views || 0) + 1 })
  const allPosts = await getAllPosts()
  const publishedPosts = allPosts.filter((p) => p.published)
  const others = publishedPosts.filter((p) => p.id !== post.id)
  const related = others.filter((p) => p.category === post.category).slice(0, 3)
  const morePosts = related.length > 0 ? related : others.slice(0, 3)

  const sorted = [...publishedPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const currentIndex = sorted.findIndex((p) => p.id === post.id)
  const newerPost = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const olderPost = currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  const rt = readTime(post.content)
  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(post.date))
  const authorName = post.author?.trim() || "Ghibli Gazette Editorial"
  const imageUrl = getPostCoverImage(post)
  const siteUrl = "https://ghibli-gazette.vercel.app"
  const ogImageUrl = `${siteUrl}/og/${post.id}`

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt || post.title,
    image: imageUrl ? [imageUrl, ogImageUrl] : [ogImageUrl],
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: [
      {
        "@type": "Person",
        name: authorName,
        url: siteUrl
      }
    ],
    publisher: {
      "@type": "Organization",
      name: "Ghibli Gazette",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.id}`
    }
  }

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel(post.category),
        item: `${siteUrl}/category/${post.category}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.id}`
      }
    ]
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImageUrl} />

      <ReadingProgress />
      <Navbar />

      {/* Main Editorial Article Container */}
      <main id="main-content" style={{ flex: 1, padding: "40px 0 80px" }}>
        <div className="shell" style={{ display: "grid", gap: "60px", gridTemplateColumns: "1fr" }}>
          <article className="reading-shell">
            {/* Breadcrumb Navigation */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                color: "var(--text3)",
                marginBottom: "20px",
                fontFamily: "var(--font-inter, system-ui, sans-serif)"
              }}
              aria-label="Breadcrumb"
            >
              <Link href="/" style={{ textDecoration: "none", color: "var(--text2)", transition: "color 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text2)"}>
                Home
              </Link>
              <span>›</span>
              <Link
                href={`/category/${post.category}`}
                style={{ textDecoration: "none", color: "var(--red)", fontWeight: 500 }}
              >
                {categoryLabel(post.category)}
              </Link>
            </nav>

            {/* Category Badge */}
            <span
              style={{
                display: "inline-block",
                marginBottom: "16px",
                padding: "4px 12px",
                borderRadius: "3px",
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                background: getCategoryColor(post.category),
                color: "#fff",
                textTransform: "uppercase"
              }}
            >
              {categoryLabel(post.category)}
            </span>

            {/* Article Title */}
            <h1
              className="font-playfair"
              style={{
                fontSize: "clamp(28px, 4.5vw, 44px)",
                fontWeight: 700,
                fontStyle: "italic",
                color: "var(--text)",
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                marginBottom: "16px"
              }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <div
                style={{
                  fontFamily: "var(--font-inter, system-ui, sans-serif)",
                  fontSize: "16px",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  color: "var(--text2)",
                  marginBottom: "24px",
                  paddingLeft: "16px",
                  borderLeft: "3px solid var(--red)"
                }}
              >
                {post.excerpt}
              </div>
            )}

            {/* Meta Bar */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "32px",
                fontSize: "11px",
                fontFamily: "var(--font-inter, system-ui, sans-serif)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                  href={`/author/${encodeURIComponent(authorName)}`}
                  style={{ color: "var(--red)", fontWeight: 600, fontSize: "12px", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                >
                  {authorName}
                </Link>
                <span style={{ color: "var(--text3)" }}>·</span>
                <time dateTime={post.date} style={{ color: "var(--text3)" }}>{dateStr}</time>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text3)", fontSize: "11px" }}>
                <span>{rt} min read</span>
                {post.views !== undefined && post.views > 0 && (
                  <>
                    <span>·</span>
                    <span>{post.views} views</span>
                  </>
                )}
                <span>·</span>
                <ReaderFontToggle />
              </div>
            </div>

            {/* Hero Banner - Category Gradient */}
            <div
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "6px",
                overflow: "hidden",
                marginBottom: "40px",
                background: getCategoryGradient(post.category),
                position: "relative",
                backgroundSize: "200% 200%",
                animation: "gradientShift 20s ease infinite"
              }}
            >
              <ImageWithFallback
                src={imageUrl}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.3
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.3) 50%, rgba(10,10,15,0) 100%)"
                }}
              />
            </div>

            {/* 30-Second Quick Briefing & Key Facts Capsule */}
            <QuickBriefing post={post} />

            {/* Rich HTML Content */}
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Interactive Manga Lightbox Support */}
            <MangaPanelLightbox />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "48px",
                  paddingTop: "24px",
                  borderTop: "1px solid var(--border)"
                }}
              >
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: "var(--card)",
                      border: "1px solid var(--border2)",
                      color: "var(--text2)",
                      textDecoration: "none",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)" }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Social Share Buttons */}
            <ShareButtons title={post.title} />

            {/* Back link */}
            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--red)",
                  textDecoration: "none"
                }}
              >
                ← Back to all stories
              </Link>
            </div>

            {/* Prev / Next Navigation */}
            <nav
              aria-label="Article navigation"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
                marginTop: "24px"
              }}
            >
              {newerPost ? (
                <Link
                  href={`/blog/${newerPost.id}`}
                  className="prev-next-card"
                  style={{
                    textDecoration: "none",
                    padding: "16px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text3)" }}>
                    ← Newer story
                  </span>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: "6px 0 0", lineHeight: 1.45 }} className="line-clamp-2">
                    {newerPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {olderPost ? (
                <Link
                  href={`/blog/${olderPost.id}`}
                  className="prev-next-card"
                  style={{
                    textDecoration: "none",
                    padding: "16px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    textAlign: "right",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text3)" }}>
                    Older story →
                  </span>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: "6px 0 0", lineHeight: 1.45 }} className="line-clamp-2">
                    {olderPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </article>

          <TableOfContents />
        </div>

        {/* More Stories To Read */}
        {morePosts.length > 0 && (
          <section
            style={{
              marginTop: "80px",
              padding: "60px 0 20px",
              background: "var(--bg2)",
              borderTop: "1px solid var(--border)"
            }}
            aria-label="Related Stories"
          >
            <div className="shell">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "32px"
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                      fontSize: "12px",
                      letterSpacing: "0.18em",
                      color: "var(--red)",
                      textTransform: "uppercase"
                    }}
                  >
                    CONTINUE READING
                  </span>
                  <h2
                    className="font-playfair"
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginTop: "4px"
                    }}
                  >
                    More Stories in {categoryLabel(post.category)}
                  </h2>
                </div>

                <Link
                  href={`/category/${post.category}`}
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--red)",
                    textDecoration: "none"
                  }}
                >
                  View Category →
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px"
                }}
              >
                {morePosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MascotButton />
      <style>{`
        .prev-next-card:hover { border-color: var(--red) !important; }
      `}</style>
    </div>
  )
}