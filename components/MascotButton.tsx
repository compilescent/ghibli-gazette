"use client"

import { useEffect, useState } from "react"

const ANIME_FACTS = [
  "Did you know? The first anime film dates back to 1917 — just 8 years after Japan's first anime newsreel.",
  "Did you know? 'One Piece' holds the Guinness World Record for the most copies published of a single comic series.",
  "Did you know? Studio Ghibli's 'Spirited Away' won the Oscar for Best Animated Feature in 2003.",
  "Did you know? Hayao Miyazaki has come out of retirement at least four times.",
  "Did you know? 'Dragon Ball' author Akira Toriyama designed characters for the video game 'Chrono Trigger'.",
  "Did you know? Japanese animation studios produce over 300 new anime series every year.",
  "Did you know? 'Neon Genesis Evangelion' was nearly canceled mid-production due to budget issues.",
  "Did you know? The manga industry in Japan is worth over ¥675 billion a year.",
  "Did you know? 'Attack on Titan' author Hajime Isayama started drawing manga when he was just 6 years old.",
  "Did you know? Totoro's name comes from a mispronunciation of 'torōru', the Japanese word for troll."
]

export default function MascotButton() {
  const [visible, setVisible] = useState(false)
  const [showFact, setShowFact] = useState(false)
  const [fact, setFact] = useState(ANIME_FACTS[0])

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  const handleClick = () => {
    if (showFact) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setShowFact(false)
      return
    }
    setFact(ANIME_FACTS[Math.floor(Math.random() * ANIME_FACTS.length)])
    setShowFact(true)
  }

  return (
    <>
      {showFact && (
        <div className="mascot-fact-pop" role="status" aria-live="polite">
          {fact}
          <button
            onClick={() => setShowFact(false)}
            style={{
              position: "absolute",
              top: "6px",
              right: "8px",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "12px",
              cursor: "pointer"
            }}
            aria-label="Dismiss fact"
          >
            ✕
          </button>
        </div>
      )}
      <button
        className="mascot-fab"
        onClick={handleClick}
        title={showFact ? "Scroll to top" : "Random anime fact"}
        aria-label={showFact ? "Scroll back to top" : "Show a random anime fact"}
      >
        {showFact ? "⬆️" : "🍥"}
      </button>
    </>
  )
}