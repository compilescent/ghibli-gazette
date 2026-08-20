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

  // Prev / next navigation (sorted newest → oldest)
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

  // JSON-LD NewsArticle & Breadcrumbs
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
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
              fontSize: "12.5px",
              color: "var(--text-muted)",
              marginBottom: "20px",
              fontFamily: "var(--font-inter, system-ui, sans-serif)"
            }}
            aria-label="Breadcrumb"
          >
            <Link href="/" style={{ textDecoration: "none", color: "var(--text-secondary)", transition: "color 0.15s" }}>
              Home
            </Link>
            <span>›</span>
            <Link
              href={`/category/${post.category}`}
              style={{ textDecoration: "none", color: "var(--accent)", fontWeight: 500 }}
            >
              {categoryLabel(post.category)}
            </Link>
          </nav>

          {/* Article Title */}
          <h1
            style={{
              fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
              fontSize: "clamp(28px, 4.5vw, 44px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              marginBottom: "16px"
            }}
          >
            {post.title}
          </h1>

          {/* Editorial Meta Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              paddingBottom: "20px",
              marginBottom: "24px",
              borderBottom: "1px solid var(--border)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-inter, system-ui, sans-serif)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                href={`/author/${encodeURIComponent(authorName)}`}
                style={{ color: "var(--text-primary)", fontWeight: 500, textDecoration: "none" }}
              >
                {authorName}
              </Link>
              <span>·</span>
              <time dateTime={post.date}>Published on {dateStr}</time>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "12.5px" }}>
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

          {/* Hero Editorial Figure */}
          {imageUrl && (
            <figure
              style={{
                margin: "0 0 28px 0",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
                background: "var(--bg-secondary)"
              }}
            >
              <ImageWithFallback
                src={imageUrl}
                alt={post.title}
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </figure>
          )}

          {/* 30-Second Quick Briefing & Key Facts Capsule */}
          <QuickBriefing post={post} />

          

          {/* Opening Lead Excerpt */}
          {post.excerpt && (
            <div
              style={{
                fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                fontSize: "1.18rem",
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: "32px",
                paddingLeft: "16px",
                borderLeft: "3px solid var(--accent)"
              }}
            >
              {post.excerpt}
            </div>
          )}

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
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.15s ease"
                  }}
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
                color: "var(--accent)",
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
                style={{
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              >
                <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  ← Newer story
                </span>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: "6px 0 0", lineHeight: 1.45 }} className="line-clamp-2">
                  {newerPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {olderPost ? (
              <Link
                href={`/blog/${olderPost.id}`}
                style={{
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  textAlign: "right",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              >
                <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Older story →
                </span>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: "6px 0 0", lineHeight: 1.45 }} className="line-clamp-2">
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
              background: "var(--bg-secondary)",
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
                      color: "var(--accent)",
                      textTransform: "uppercase"
                    }}
                  >
                    CONTINUE READING
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
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
                    color: "var(--accent)",
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
                  gap: "24px"
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
    </div>
  )
}
