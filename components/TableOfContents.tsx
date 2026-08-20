"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const content = document.querySelector(".prose-article")
    if (!content) return

    const headings = Array.from(content.querySelectorAll("h2, h3")).map((h) => ({
      id: h.id,
      text: h.textContent || "",
      level: Number(h.tagName[1]),
    }))

    if (headings.length < 3) return
    setHeadings(headings)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -66%", threshold: 0 }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  if (headings.length < 3) return null

  return (
    <aside className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
      <nav aria-label="Table of contents">
        <h3 className="font-bebas text-xs tracking-widest text-accent uppercase mb-4">In This Article</h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
              <Link
                href={`#${heading.id}`}
                className={`block py-1 transition-colors ${
                  activeId === heading.id
                    ? "text-accent font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const target = document.getElementById(heading.id)
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" })
                    history.pushState(null, "", `#${heading.id}`)
                    setActiveId(heading.id)
                  }
                }}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}