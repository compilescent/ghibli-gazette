"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
          color: "#F0EEE8",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ textAlign: "center", padding: "40px 20px", maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "12px" }} aria-hidden="true">🌩️</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", margin: "0 0 10px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9896A8", fontSize: "15px", lineHeight: 1.7, margin: "0 0 24px" }}>
            The wires got crossed in the broadcast booth. Give it another shot — or head back home.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#E8643A",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}