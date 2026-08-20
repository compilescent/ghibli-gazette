"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Page render error:", error)
  }, [error])

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "40px 20px",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "12px" }} aria-hidden="true">⚡</div>
      <h1
        style={{
          fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
          fontSize: "clamp(22px, 4vw, 32px)",
          color: "var(--text-primary)",
          margin: "0 0 12px"
        }}
      >
        A glitch in the spirit world
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--text-secondary)",
          maxWidth: "440px",
          lineHeight: 1.7,
          margin: "0 0 28px"
        }}
      >
        Something flickered while rendering this page. Your signal was interrupted, but we can restore it.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={reset} className="btn btn-primary">
          Try Again
        </button>
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </main>
  )
}