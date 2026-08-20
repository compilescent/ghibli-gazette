import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ghibli-gazette.vercel.app"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}