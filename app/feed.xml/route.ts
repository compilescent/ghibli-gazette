import { NextResponse } from "next/server"
import { getAllPosts } from "@/lib/posts"
import { getPostCoverImage } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const posts = await getAllPosts()
  const publishedPosts = posts.filter((p) => p.published).slice(0, 30)

  const siteUrl = "https://ghibli-gazette.vercel.app"

  const itemsXml = publishedPosts
    .map((post) => {
      const cover = getPostCoverImage(post)
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.id}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <category><![CDATA[${post.category}]]></category>
      <author><![CDATA[${post.author || "Ghibli Gazette Editorial"}]]></author>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${cover ? `<enclosure url="${cover}" type="image/jpeg" />` : ""}
    </item>`
    })
    .join("\n")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ghibli Gazette — Anime &amp; Studio Ghibli News</title>
    <link>${siteUrl}</link>
    <description>Your premier source for Studio Ghibli news, anime reviews, new releases, and seasonal premieres.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rssXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600"
    }
  })
}
