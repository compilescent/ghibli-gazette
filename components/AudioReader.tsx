"use client"

import { useState, useEffect, useRef } from "react"

interface AudioReaderProps {
  title: string
  content: string
}

export default function AudioReader({ title, content }: AudioReaderProps) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!supported) return null

  const getCleanText = () => {
    const raw = `${title}. ${content}`
    return raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  }

  const handlePlay = () => {
    if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
      setSpeaking(true)
      return
    }

    window.speechSynthesis.cancel()
    const text = getCleanText()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = speed
    utter.pitch = 1.0

    utter.onend = () => {
      setSpeaking(false)
      setPaused(false)
    }

    utter.onerror = () => {
      setSpeaking(false)
      setPaused(false)
    }

    utterRef.current = utter
    window.speechSynthesis.speak(utter)
    setSpeaking(true)
    setPaused(false)
  }

  const handlePause = () => {
    if (speaking && !paused) {
      window.speechSynthesis.pause()
      setPaused(true)
      setSpeaking(false)
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  const toggleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1
    setSpeed(nextSpeed)
    if (speaking) {
      handleStop()
      setTimeout(() => {
        const text = getCleanText()
        const utter = new SpeechSynthesisUtterance(text)
        utter.rate = nextSpeed
        utter.pitch = 1.0
        utter.onend = () => {
          setSpeaking(false)
          setPaused(false)
        }
        utterRef.current = utter
        window.speechSynthesis.speak(utter)
        setSpeaking(true)
      }, 50)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderRadius: "8px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        margin: "20px 0 28px",
        fontSize: "13px",
        color: "var(--text-secondary)"
      }}
      role="region"
      aria-label="Audio Reader"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "16px" }}>🎙️</span>
        <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
          {speaking ? "Playing Narration..." : paused ? "Narration Paused" : "Listen to Story"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={toggleSpeed}
          style={{
            padding: "3px 8px",
            borderRadius: "4px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer"
          }}
          title="Change playback speed"
          aria-label={`Playback speed ${speed}x`}
        >
          {speed}x
        </button>

        {!speaking && !paused ? (
          <button
            onClick={handlePlay}
            className="btn btn-primary"
            style={{
              padding: "5px 14px",
              fontSize: "12px",
              borderRadius: "999px",
              minHeight: "auto"
            }}
          >
            ▶ Play
          </button>
        ) : speaking ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={handlePause}
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              ⏸ Pause
            </button>
            <button
              onClick={handleStop}
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              ⏹ Stop
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={handlePlay}
              className="btn btn-primary"
              style={{
                padding: "5px 14px",
                fontSize: "12px",
                borderRadius: "999px",
                minHeight: "auto"
              }}
            >
              ▶ Resume
            </button>
            <button
              onClick={handleStop}
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              ⏹
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
