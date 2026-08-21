const HISTORY_FACTS: { month: number; day: number; text: string }[] = [
  { month: 1, day: 5, text: "In 1988, Hayao Miyazaki's 'My Neighbor Totoro' premiered in Japanese theaters — and quietly changed animation forever." },
  { month: 1, day: 27, text: "In 1917, Japan's first surviving anime short film debuted, kicking off over a century of animation history." },
  { month: 2, day: 12, text: "In 2004, 'Spirited Away' became the first non-English-language film to win the Oscar for Best Animated Feature." },
  { month: 3, day: 3, text: "In 2001, Studio Ghibli and Tokuma Shoten opened the Ghibli Museum in Mitaka, Tokyo." },
  { month: 4, day: 6, text: "In 1997, 'Princess Mononoke' premiered and went on to become Japan's highest-grossing film at the time." },
  { month: 5, day: 20, text: "In 2008, Makoto Shinkai's '5 Centimeters per Second' wowed audiences with its breathtaking realism." },
  { month: 6, day: 21, text: "In 2013, 'Attack on Titan' premiered its first episode, igniting a global anime phenomenon." },
  { month: 7, day: 20, text: "In 2001, 'Spirited Away' opened in Japanese theaters and became the country's highest-grossing film ever." },
  { month: 8, day: 2, text: "In 1987, Katsuhiro Otomo began serializing 'Akira' in Young Magazine — the manga that changed anime forever." },
  { month: 9, day: 13, text: "In 1988, 'Grave of the Fireflies' and 'My Neighbor Totoro' opened in theaters on the same day." },
  { month: 10, day: 3, text: "In 1995, 'Neon Genesis Evangelion' premiered on TV and rewrote the rules of mecha anime." },
  { month: 11, day: 9, text: "In 2014, 'Your Name' (Kimi no Na wa) director Makoto Shinkai's crew began pre-production on the global hit." },
  { month: 12, day: 14, text: "In 2023, 'The Boy and the Heron' won the Golden Globe for Best Animated Feature — a first for a Japanese studio film." }
]

export default function TodayInHistory() {
  const now = new Date()
  const today = HISTORY_FACTS.find((f) => f.month === now.getMonth() + 1 && f.day === now.getDate())
  const fallback = HISTORY_FACTS[now.getDate() % HISTORY_FACTS.length]
  const fact = today ?? fallback
  const dateStr = new Intl.DateTimeFormat("en", { month: "long", day: "numeric" }).format(now)

  return (
    <aside
      style={{
        background: "linear-gradient(135deg, #1a1535, #2d1b69)",
        border: "1px solid #667eea44",
        borderRadius: "6px",
        padding: "16px"
      }}
      aria-label="Today in Anime History"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "16px" }}>📜</span>
        <span
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "13px",
            letterSpacing: "0.12em",
            color: "#fff",
            textTransform: "uppercase"
          }}
        >
          TODAY IN ANIME HISTORY
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            background: "#667eea",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "3px"
          }}
        >
          {dateStr}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", lineHeight: 1.6, color: "rgba(255,255,255,0.85)", margin: 0 }}>
        {fact.text}
      </p>
    </aside>
  )
}