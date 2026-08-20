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
        padding: "20px",
        background: "var(--bg-elevated)",
        borderRadius: "8px",
        border: "1px solid var(--border)"
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "13px",
          letterSpacing: "0.2em",
          color: "var(--text-muted)",
          marginBottom: "14px"
        }}
      >
        SHARE THIS STORY
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={copyLink}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            background: copied ? "var(--accent)" : "var(--bg-card)",
            color: copied ? "#fff" : "var(--text-primary)",
            border: "1px solid var(--border-light)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {copied ? "✓ Copied Link" : "⧉ Copy Link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${titleEncoded}&url=${encoded}`}
          target="_blank"
          rel="noreferrer"
          className="share-social-btn"
          style={{ background: "#1DA1F2" }}
        >
          Twitter
        </a>
        <a
          href={`https://reddit.com/submit?url=${encoded}&title=${titleEncoded}`}
          target="_blank"
          rel="noreferrer"
          className="share-social-btn"
          style={{ background: "#FF4500" }}
        >
          Reddit
        </a>
        <a
          href={`https://wa.me/?text=${titleEncoded}%20${encoded}`}
          target="_blank"
          rel="noreferrer"
          className="share-social-btn"
          style={{ background: "#25D366", color: "#082416" }}
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}
