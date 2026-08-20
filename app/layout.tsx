import type { Metadata } from "next"
import { Bebas_Neue, Inter, Libre_Baskerville } from "next/font/google"
import "./globals.css"
import ScrollProgress from "@/components/ScrollProgress"
import KonamiMode from "@/components/KonamiMode"

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap"
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-baskerville",
  display: "swap"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ghibli-gazette.vercel.app"),
  title: {
    default: "Ghibli Gazette — Anime & Manga News Hub",
    template: "%s | Ghibli Gazette"
  },
  description:
    "Your anime & manga news hub: breaking anime news, manga updates, reviews, new releases, seasonal premieres, and industry intel — updated daily.",
  keywords: [
    "anime news",
    "manga news",
    "anime releases",
    "seasonal anime",
    "Studio Ghibli",
    "anime reviews",
    "industry intel",
    "anime updates"
  ],
  openGraph: {
    type: "website",
    url: "https://ghibli-gazette.vercel.app",
    siteName: "Ghibli Gazette",
    title: "Ghibli Gazette — Anime & Manga News Hub",
    description: "Breaking anime news, manga updates, reviews, releases, premieres, and industry intel.",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghibli Gazette — Anime & Manga News Hub",
    description: "Breaking anime news, manga updates, reviews, releases, premieres, and industry intel."
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${baskerville.variable}`}>
      <body>
        <ScrollProgress />
        <KonamiMode />
        {children}
      </body>
    </html>
  )
}