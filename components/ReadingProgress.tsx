"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div
      className="fixed top-14 left-0 right-0 h-0.5 bg-bg-elevated z-40 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-accent origin-left transition-transform duration-100 ease-linear"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  )
}