"use client"

import { useState } from "react"

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    if (typeof window === "undefined") return
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const encoded = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""
  const titleEncoded = encodeURIComponent(title)

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "16px",
        background: "var(--card)",
        borderRadius: "6px",
        border: "1px solid var(--border)"
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "12px",
          letterSpacing: "0.15em",
          color: "var(--text3)",
          marginBottom: "14px"
        }}
      >
        SHARE THIS STORY
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={copyLink}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            background: copied ? "var(--red)" : "var(--card)",
            color: copied ? "#fff" : "var(--text)",
            border: copied ? "1px solid var(--red)" : "1px solid var(--border2)",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          {copied ? "✓ Copied" : "⧉ Copy Link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${titleEncoded}&url=${encoded}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            transition: "opacity 0.15s ease",
            background: "var(--text)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <span style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: "8px", fontSize: "14px" }}>𝕏</span>
          Twitter
        </a>
        <a
          href={`https://reddit.com/submit?url=${encoded}&title=${titleEncoded}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            transition: "opacity 0.15s ease",
            background: "#FF4500"
          }}
        >
          Reddit
        </a>
        <a
          href={`https://wa.me/?text=${titleEncoded}%20${encoded}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            transition: "opacity 0.15s ease",
            background: "#25D366"
          }}
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}