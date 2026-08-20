"use client"

import { useState } from "react"

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string
  fallbackSrc?: string
  franchiseFallback?: string
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop"

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  franchiseFallback,
  className,
  style,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src)
  const [failedOnce, setFailedOnce] = useState(false)
  const [failedCompletely, setFailedCompletely] = useState(false)

  const handleError = () => {
    if (!failedOnce) {
      setFailedOnce(true)
      setImgSrc(franchiseFallback || fallbackSrc)
    } else {
      setFailedCompletely(true)
    }
  }

  if (failedCompletely || !imgSrc) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #181928, #2a1a0a)",
          color: "var(--accent)",
          padding: "16px",
          textAlign: "center",
          ...style
        }}
      >
        <span style={{ fontSize: "24px", marginBottom: "4px" }}>🏮</span>
        <span
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "13px",
            letterSpacing: "0.1em",
            color: "var(--text-secondary)"
          }}
        >
          {alt || "GHIBLI GAZETTE"}
        </span>
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt || "Anime visual"}
      onError={handleError}
      className={className}
      style={style}
      loading="lazy"
      {...props}
    />
  )
}
