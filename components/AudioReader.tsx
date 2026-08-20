"use client"

import { useState, useEffect, useRef } from "react"

export type VoicePersona = "madara" | "marin" | "studio"

interface AudioReaderProps {
  title: string
  content: string
}

interface PersonaConfig {
  id: VoicePersona
  name: string
  badge: string
  desc: string
  intro: string
  pitch: number
  rate: number
  themeColor: string
  accentColor: string
  avatar: string
}

const PERSONAS: PersonaConfig[] = [
  {
    id: "madara",
    name: "Madara Uchiha",
    badge: "GHOST OF UCHIHA",
    desc: "Deep, commanding storytelling baritone with dramatic gravity.",
    intro: "Wake up to reality. Nothing ever goes as planned in this cursed world... but listen closely as this chronicle unfolds.",
    pitch: 0.65,
    rate: 0.94,
    themeColor: "#ef4444",
    accentColor: "#f87171",
    avatar: "🔥"
  },
  {
    id: "marin",
    name: "Marin Kitagawa",
    badge: "GYARU ENTHUSIAST",
    desc: "Energetic, lively anime storyteller with enthusiastic pacing.",
    intro: "Yaaay! Oh my god, you totally HAVE to hear this story! Let's get right into the good stuff!",
    pitch: 1.45,
    rate: 1.14,
    themeColor: "#ec4899",
    accentColor: "#f472b6",
    avatar: "🌸"
  },
  {
    id: "studio",
    name: "Studio Anchor",
    badge: "EXECUTIVE NEWS",
    desc: "Balanced, clear, high-fidelity editorial broadcast.",
    intro: "Welcome to the Ghibli Gazette executive story briefing.",
    pitch: 1.0,
    rate: 1.05,
    themeColor: "#E8643A",
    accentColor: "#F0C040",
    avatar: "🎙️"
  }
]

export default function AudioReader({ title, content }: AudioReaderProps) {
  const [supported, setSupported] = useState(false)
  const [activePersona, setActivePersona] = useState<VoicePersona>("madara")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentChunkIdx, setCurrentChunkIdx] = useState(0)
  const [chunks, setChunks] = useState<string[]>([])
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const isPlayingRef = useRef(false)

  // Detect Web Speech API and load voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true)

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setAvailableVoices(voices)
        }
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  // Clean text and break into reliable storytelling chunks
  useEffect(() => {
    const rawContent = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    const rawFullText = `${title}. ${rawContent}`

    // Split text into natural sentence chunks to prevent browser speech synthesis timeouts
    const sentenceList = rawFullText
      .match(/[^.!?]+[.!?]+(\s|$)/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length > 0) || [rawFullText]

    setChunks(sentenceList)
  }, [title, content])

  // Stop on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        isPlayingRef.current = false
      }
    }
  }, [])

  if (!supported) return null

  const currentPersona = PERSONAS.find((p) => p.id === activePersona) || PERSONAS[0]

  // Pick the best voice matching the persona
  const pickBestVoice = (persona: VoicePersona): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null

    const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"))
    const pool = englishVoices.length > 0 ? englishVoices : availableVoices

    if (persona === "madara") {
      // Prioritize deep male voices
      const maleVoice = pool.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("daniel") ||
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("george") ||
          v.name.toLowerCase().includes("uk english")
      )
      return maleVoice || pool[0]
    } else if (persona === "marin") {
      // Prioritize bright female voices
      const femaleVoice = pool.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("karen") ||
          v.name.toLowerCase().includes("victoria") ||
          v.name.toLowerCase().includes("zira")
      )
      return femaleVoice || pool[pool.length - 1]
    }

    return pool[0]
  }

  // Play a specific chunk recursively
  const speakChunk = (chunkIndex: number) => {
    if (!isPlayingRef.current || chunkIndex >= chunks.length) {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentChunkIdx(0)
      isPlayingRef.current = false
      return
    }

    window.speechSynthesis.cancel()

    let textToSpeak = chunks[chunkIndex]
    // If it's the start, prepend the persona's dramatic intro
    if (chunkIndex === 0 && currentPersona.intro) {
      textToSpeak = `${currentPersona.intro} ... ${textToSpeak}`
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.pitch = currentPersona.pitch
    utterance.rate = currentPersona.rate

    const voice = pickBestVoice(activePersona)
    if (voice) {
      utterance.voice = voice
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        const nextIdx = chunkIndex + 1
        setCurrentChunkIdx(nextIdx)
        speakChunk(nextIdx)
      }
    }

    utterance.onerror = (err) => {
      console.warn("Speech synthesis chunk error:", err)
      if (isPlayingRef.current) {
        const nextIdx = chunkIndex + 1
        setCurrentChunkIdx(nextIdx)
        speakChunk(nextIdx)
      }
    }

    window.speechSynthesis.speak(utterance)
  }

  const handleStart = () => {
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      isPlayingRef.current = true
      return
    }

    isPlayingRef.current = true
    setIsPlaying(true)
    setIsPaused(false)
    setCurrentChunkIdx(0)
    speakChunk(0)
  }

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    isPlayingRef.current = false
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentChunkIdx(0)
  }

  const handlePersonaChange = (newPersona: VoicePersona) => {
    const wasPlaying = isPlaying || isPaused
    handleStop()
    setActivePersona(newPersona)
    if (wasPlaying) {
      setTimeout(() => {
        isPlayingRef.current = true
        setIsPlaying(true)
        speakChunk(0)
      }, 100)
    }
  }

  const progressPercent = chunks.length > 0 ? Math.round((currentChunkIdx / chunks.length) * 100) : 0

  return (
    <div
      style={{
        margin: "24px 0 32px",
        borderRadius: "12px",
        background: "var(--bg-card)",
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
        overflow: "hidden",
        position: "relative"
      }}
      className="saas-audio-dock"
      role="region"
      aria-label="Story Narration Player"
    >
      {/* Top Ambient Glow Bar */}
      <div
        style={{
          height: "3px",
          width: "100%",
          background: `linear-gradient(90deg, ${currentPersona.themeColor}, ${currentPersona.accentColor})`,
          transition: "background 0.3s ease"
        }}
      />

      {/* Main SaaS Player UI */}
      <div style={{ padding: "16px 20px" }}>
        {/* Upper Row: Persona Switcher Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>{currentPersona.avatar}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                  {currentPersona.name}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
                    letterSpacing: "0.1em",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    background: currentPersona.themeColor,
                    color: "#fff"
                  }}
                >
                  {currentPersona.badge}
                </span>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                {currentPersona.desc}
              </p>
            </div>
          </div>

          {/* Persona Selection Pills */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "var(--bg-elevated)",
              padding: "3px",
              borderRadius: "8px",
              border: "1px solid var(--border)"
            }}
          >
            {PERSONAS.map((p) => {
              const isSelected = activePersona === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p.id)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    background: isSelected ? "var(--bg-card)" : "transparent",
                    color: isSelected ? "#fff" : "var(--text-secondary)",
                    boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.4)" : "none",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  title={p.desc}
                >
                  <span>{p.avatar}</span>
                  <span>{p.name.split(" ")[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Middle Row: Waveform Visualizer & Playback Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "var(--bg-elevated)",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            marginBottom: "12px"
          }}
        >
          {/* Animated Equalizer Waveform */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3px",
                height: "18px",
                width: "28px"
              }}
            >
              {[0.4, 0.9, 0.6, 1, 0.7].map((height, i) => (
                <span
                  key={i}
                  style={{
                    width: "3px",
                    height: isPlaying ? `${height * 18}px` : "4px",
                    background: currentPersona.themeColor,
                    borderRadius: "2px",
                    animation: isPlaying ? `equalizerWave 0.8s ease-in-out infinite alternate ${i * 0.15}s` : "none",
                    transition: "height 0.2s ease"
                  }}
                />
              ))}
            </div>

            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
              {isPlaying
                ? `Storytelling in session (Part ${currentChunkIdx + 1} of ${chunks.length})`
                : isPaused
                ? "Narration Paused"
                : "Ready to Narrate"}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {!isPlaying && !isPaused ? (
              <button
                onClick={handleStart}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 18px",
                  borderRadius: "999px",
                  background: currentPersona.themeColor,
                  color: "#fff",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 2px 12px ${currentPersona.themeColor}55`,
                  transition: "transform 0.15s ease"
                }}
              >
                <span>▶</span>
                <span>Listen with {currentPersona.name.split(" ")[0]}</span>
              </button>
            ) : isPlaying ? (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={handlePause}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  ⏸ Pause
                </button>
                <button
                  onClick={handleStop}
                  style={{
                    padding: "6px 14px",
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
                  onClick={handleStart}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "999px",
                    background: currentPersona.themeColor,
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  ▶ Resume
                </button>
                <button
                  onClick={handleStop}
                  style={{
                    padding: "6px 12px",
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

        {/* Bottom Row: Story Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background: "var(--bg-elevated)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: currentPersona.themeColor,
                transition: "width 0.3s ease"
              }}
            />
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
            {progressPercent}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes equalizerWave {
          0% { height: 3px; }
          100% { height: 18px; }
        }
      `}</style>
    </div>
  )
}
