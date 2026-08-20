"use client"

import { useEffect } from "react"

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
]

/**
 * Konami code easter egg: toggles "Calcifer mode" (fire-gradient theme).
 */
export default function KonamiMode() {
  useEffect(() => {
    let index = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      index = key === KONAMI[index] ? index + 1 : 0

      if (timer) clearTimeout(timer)
      timer = setTimeout(() => (index = 0), 4000)

      if (index === KONAMI.length) {
        index = 0
        const root = document.documentElement
        const isActive = root.classList.contains("calcifer")
        root.classList.toggle("calcifer")
        if (!isActive) {
          console.log("🔥 Calcifer mode activated! The fire is burning bright.")
        }
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return null
}