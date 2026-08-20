"use client"

import { useEffect, useRef, useState } from "react"

interface BreakingTickerProps {
  items: string[]
}

/** Calm, readable news-ticker pace in pixels per second */
const SPEED_PX_PER_SEC = 42

export default function BreakingTicker({ items }: BreakingTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(60)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      // Content is duplicated for a seamless loop, so one copy = half the width
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

  const text = items.join("   ✦   ")

  return (
    <section
      aria-label="Breaking News Ticker"
      style={{
        background: "linear-gradient(90deg, #E8643A, #F07550, #C94FAE, #667eea, #E8643A)",
        backgroundSize: "300% 100%",
        animation: "gradientShift 12s ease infinite",
        height: "34px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "0 16px",
          background: "rgba(0, 0, 0, 0.3)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "13px",
          letterSpacing: "0.15em",
          color: "#fff",
          whiteSpace: "nowrap"
        }}
      >
        <span style={{ fontSize: "14px" }}>⚡</span>
        <span>BREAKING</span>
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#fff",
            animation: "pulse-dot 1.5s ease-in-out infinite",
            display: "inline-block",
            marginLeft: "2px"
          }}
        />
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
              fontWeight: 600,
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