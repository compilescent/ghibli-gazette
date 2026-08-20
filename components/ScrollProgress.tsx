"use client"

import { useEffect } from "react"

export default function ScrollProgress() {
  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (scrolled / total) * 100 : 0
      document.documentElement.style.setProperty("--scroll-progress", `${pct}%`)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return <div className="scroll-progress" aria-hidden="true" />
}
