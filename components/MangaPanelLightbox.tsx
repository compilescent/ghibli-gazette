"use client"

import { useState, useEffect } from "react"

export default function MangaPanelLightbox() {
  const [activeImg, setActiveImg] = useState<{ src: string; caption?: string } | null>(null)

  useEffect(() => {
    const handleImgClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG" && (target.classList.contains("manga-panel-img") || target.closest(".manga-panel-figure"))) {
        e.preventDefault()
        const img = target as HTMLImageElement
        const figure = img.closest(".manga-panel-figure")
        const captionEl = figure?.querySelector(".manga-panel-caption")
        const caption = captionEl?.textContent || img.alt || ""
        setActiveImg({ src: img.src, caption })
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImg(null)
      }
    }

    document.addEventListener("click", handleImgClick)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("click", handleImgClick)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!activeImg) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(0, 0, 0, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}
      onClick={() => setActiveImg(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Manga Panel Viewer"
    >
      {/* Close button */}
      <button
        onClick={() => setActiveImg(null)}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "#fff",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10
        }}
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Image in Darkroom Frame */}
      <div
        style={{
          maxWidth: "92vw",
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={activeImg.src}
          alt={activeImg.caption || "Manga panel"}
          style={{
            maxWidth: "100%",
            maxHeight: "75vh",
            objectFit: "contain",
            borderRadius: "6px",
            boxShadow: "0 0 48px rgba(232, 100, 58, 0.2), 0 24px 64px rgba(0,0,0,0.9)",
            border: "1px solid var(--border-light)"
          }}
        />

        {activeImg.caption && (
          <div
            style={{
              marginTop: "16px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontSize: "13px",
              textAlign: "center",
              maxWidth: "800px"
            }}
          >
            {activeImg.caption}
          </div>
        )}
      </div>
    </div>
  )
}
