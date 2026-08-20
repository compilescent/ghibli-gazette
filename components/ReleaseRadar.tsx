"use client"

import { useState, useEffect } from "react"

interface ReleaseItem {
  id: string
  title: string
  franchise: string
  studio: string
  format: "Movie" | "TV Anime" | "Exhibition"
  releaseDate: string // YYYY-MM-DD
  platform: string
  coverImage: string
}

const UPCOMING_RELEASES: ReleaseItem[] = [
  {
    id: "ds-infinity-castle",
    title: "Demon Slayer: Infinity Castle — Part 1",
    franchise: "Demon Slayer",
    studio: "ufotable",
    format: "Movie",
    releaseDate: "2026-10-16",
    platform: "Global Theatrical",
    coverImage: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
  },
  {
    id: "chainsaw-man-reze",
    title: "Chainsaw Man – The Movie: Reze Arc",
    franchise: "Chainsaw Man",
    studio: "MAPPA",
    format: "Movie",
    releaseDate: "2026-12-18",
    platform: "Theaters & Crunchyroll",
    coverImage: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg"
  },
  {
    id: "frieren-s2",
    title: "Frieren: Beyond Journey's End Season 2",
    franchise: "Frieren",
    studio: "Madhouse",
    format: "TV Anime",
    releaseDate: "2027-01-08",
    platform: "Crunchyroll",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg"
  },
  {
    id: "solo-leveling-s2",
    title: "Solo Leveling Season 2: Arise from the Shadow",
    franchise: "Solo Leveling",
    studio: "A-1 Pictures",
    format: "TV Anime",
    releaseDate: "2027-01-10",
    platform: "Crunchyroll / Ani-One",
    coverImage: "https://cdn.myanimelist.net/images/anime/1598/128450.jpg"
  },
  {
    id: "ghibli-exhibition-2026",
    title: "Ghibli Park Valley of Witches Autumn Exhibition",
    franchise: "Studio Ghibli",
    studio: "Studio Ghibli",
    format: "Exhibition",
    releaseDate: "2026-11-01",
    platform: "Aichi Expo Park, Japan",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop"
  }
]

function getCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isReleased: true }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, isReleased: false }
}

export default function ReleaseRadar() {
  const [filter, setFilter] = useState<"All" | "Movie" | "TV Anime" | "Exhibition">("All")
  const [countdowns, setCountdowns] = useState<Record<string, { days: number; hours: number; minutes: number; isReleased: boolean }>>({})

  useEffect(() => {
    const update = () => {
      const state: Record<string, any> = {}
      UPCOMING_RELEASES.forEach((item) => {
        state[item.id] = getCountdown(item.releaseDate)
      })
      setCountdowns(state)
    }
    update()
    const timer = setInterval(update, 60000)
    return () => clearInterval(timer)
  }, [])

  const filtered = filter === "All" ? UPCOMING_RELEASES : UPCOMING_RELEASES.filter((r) => r.format === filter)

  return (
    <section
      style={{
        padding: "48px 0",
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)"
      }}
      aria-label="Anime Release Radar"
    >
      <div className="shell">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "28px"
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                fontSize: "13px",
                letterSpacing: "0.18em",
                color: "var(--accent)",
                textTransform: "uppercase"
              }}
            >
              RELEASE RADAR &amp; COUNTDOWN
            </span>
            <h2
              style={{
                fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                fontSize: "26px",
                fontWeight: 700,
                color: "#fff",
                margin: "4px 0 0"
              }}
            >
              Upcoming Anime &amp; Theatrical Schedules
            </h2>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "6px" }}>
            {(["All", "Movie", "TV Anime", "Exhibition"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: filter === f ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: filter === f ? "var(--accent)" : "var(--bg-elevated)",
                  color: filter === f ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s ease"
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Release Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px"
          }}
        >
          {filtered.map((item) => {
            const cd = countdowns[item.id] || { days: 0, hours: 0, minutes: 0, isReleased: false }
            return (
              <div
                key={item.id}
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.2s ease, border-color 0.2s ease"
                }}
                className="radar-card"
              >
                {/* Thumbnail */}
                <div style={{ height: "130px", position: "relative", overflow: "hidden" }}>
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10, 11, 16, 0.85) 0%, transparent 60%)"
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      fontSize: "10px",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                      letterSpacing: "0.1em",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      background: "var(--accent)",
                      color: "#fff"
                    }}
                  >
                    {item.format}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.studio} · {item.platform}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.35,
                      margin: "6px 0 12px"
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Countdown Bar */}
                  <div
                    style={{
                      marginTop: "auto",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>COUNTDOWN:</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--gold)", fontFamily: "monospace" }}>
                      {cd.isReleased ? "NOW AIRING" : `${cd.days}d ${cd.hours}h ${cd.minutes}m`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
