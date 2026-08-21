"use client"

import { useEffect, useRef, useState } from "react"

interface BreakingTickerProps {
  items: string[]
}

const SPEED_PX_PER_SEC = 42

export default function BreakingTicker({ items }: BreakingTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(60)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      const copyWidth = track.scrollWidth / 2
      if (copyWidth > 0) {
        setDuration(Math.max(24, copyWidth / SPEED_PX_PER_SEC))
      }
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  const text = items.join("  ✦  ")

  return (
    <section
      aria-label="Breaking News Ticker"
      style={{
        background: "var(--red)",
        height: "36px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "0 16px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "14px",
          letterSpacing: "0.1em",
          color: "#fff",
          whiteSpace: "nowrap",
          borderRight: "1px solid rgba(255,255,255,0.3)"
        }}
      >
        <span style={{ fontSize: "14px" }}>⚡</span>
        <span>BREAKING</span>
      </div>
      <div className="ticker-wrap" style={{ flex: 1 }}>
        <div
          ref={trackRef}
          className="ticker-content"
          style={{ "--ticker-duration": `${duration}s` } as React.CSSProperties}
        >
          <span
            style={{
              padding: "0 28px",
              fontSize: "12px",
              fontWeight: 500,
              color: "#fff",
              fontFamily: "var(--font-inter, system-ui, sans-serif)",
              letterSpacing: "0.02em"
            }}
          >
            {text}&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;{text}
          </span>
        </div>
      </div>
    </section>
  )
}