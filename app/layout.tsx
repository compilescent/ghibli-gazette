import type { Metadata } from "next"
import { Bebas_Neue, Inter, Libre_Baskerville } from "next/font/google"
import "./globals.css"
import ScrollProgress from "@/components/ScrollProgress"

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
  title: "Ghibli Gazette — Anime & Studio Ghibli News",
  description: "Your premier source for Studio Ghibli news, anime reviews, new releases, and seasonal premieres."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${baskerville.variable}`}>
      <body>
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
