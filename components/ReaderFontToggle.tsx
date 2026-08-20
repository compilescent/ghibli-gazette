"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "gg_reader_size"

type ReaderSize = "s" | "m" | "l"

export default function ReaderFontToggle() {
  const [size, setSize] = useState<ReaderSize>("m")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ReaderSize | null
    if (saved && ["s", "m", "l"].includes(saved)) {
      setSize(saved)
    }
  }, [])

  const applySize = (next: ReaderSize) => {
    setSize(next)
    localStorage.setItem(STORAGE_KEY, next)
    const root = document.documentElement
    root.classList.remove("reader-size-s", "reader-size-m", "reader-size-l")
    if (next !== "m") root.classList.add(`reader-size-${next}`)
  }

  useEffect(() => {
    applySize(size)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-light)",
        borderRadius: "999px",
        padding: "3px"
      }}
      role="group"
      aria-label="Text size"
      title="Adjust reading text size"
    >
      {(["s", "m", "l"] as ReaderSize[]).map((s) => (
        <button
          key={s}
          onClick={() => applySize(s)}
          aria-pressed={size === s}
          aria-label={s === "s" ? "Small text" : s === "m" ? "Medium text" : "Large text"}
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: s === "s" ? "10px" : s === "m" ? "12px" : "14px",
            fontWeight: 700,
            background: size === s ? "var(--accent)" : "transparent",
            color: size === s ? "#fff" : "var(--text-muted)",
            transition: "all 0.15s ease"
          }}
        >
          A
        </button>
      ))}
    </div>
  )
}