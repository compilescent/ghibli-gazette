import { type Post } from "@/lib/types"

interface QuickBriefingProps {
  post: Post
}

function inferBriefing(post: Post) {
  const text = (post.title + " " + post.content + " " + (post.excerpt || "")).toLowerCase()

  // Studio inference
  let studio = "Studio Ghibli"
  if (text.includes("mappa")) studio = "MAPPA"
  else if (text.includes("ufotable")) studio = "ufotable"
  else if (text.includes("madhouse")) studio = "Madhouse"
  else if (text.includes("wit studio")) studio = "WIT Studio"
  else if (text.includes("science saru")) studio = "Science SARU"
  else if (text.includes("trigger")) studio = "Studio Trigger"
  else if (text.includes("a-1 pictures")) studio = "A-1 Pictures"
  else if (text.includes("pierrot")) studio = "Studio Pierrot"
  else if (text.includes("toei")) studio = "Toei Animation"
  else if (text.includes("bones")) studio = "Studio Bones"
  else if (text.includes("cloverworks")) studio = "CloverWorks"
  else if (text.includes("production i.g")) studio = "Production I.G"
  else if (text.includes("coMix wave") || text.includes("shinkai")) studio = "CoMix Wave Films"

  // Platform inference
  let platform = "Theaters & Global Streaming"
  if (text.includes("netflix")) platform = "Netflix"
  else if (text.includes("crunchyroll")) platform = "Crunchyroll"
  else if (text.includes("disney+")) platform = "Disney+"
  else if (text.includes("hulu")) platform = "Hulu"
  else if (text.includes("theatrical") || text.includes("movie") || text.includes("film")) platform = "Theaters Worldwide"

  // Status / Timing inference
  let timing = "Confirmed & In Production"
  if (text.includes("october 2026") || text.includes("fall 2026")) timing = "Fall 2026 Season"
  else if (text.includes("winter 2027") || text.includes("january")) timing = "Winter 2027"
  else if (text.includes("august") || text.includes("summer")) timing = "Summer 2026 Broadcast"
  else if (text.includes("2027")) timing = "2027 Release Window"

  // Generate 3 takeaways
  const takeaways: string[] = []
  if (post.excerpt) {
    takeaways.push(post.excerpt)
  }
  takeaways.push(`Key production helmed by ${studio} with global distribution via ${platform}.`)
  takeaways.push(`Production schedule targeted for ${timing}.`)

  return { studio, platform, timing, takeaways: takeaways.slice(0, 3) }
}

export default function QuickBriefing({ post }: QuickBriefingProps) {
  const { studio, platform, timing, takeaways } = inferBriefing(post)

  return (
    <aside
      style={{
        margin: "28px 0 36px 0",
        padding: "20px 24px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, rgba(232, 100, 58, 0.08) 0%, rgba(22, 24, 35, 0.95) 100%)",
        border: "1px solid rgba(232, 100, 58, 0.3)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)"
      }}
      aria-label="30-Second Article Briefing"
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "16px" }}>⚡</span>
        <span
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "15px",
            letterSpacing: "0.15em",
            color: "var(--accent)",
            textTransform: "uppercase"
          }}
        >
          30-SECOND BRIEFING &amp; KEY FACTS
        </span>
      </div>

      {/* Facts Pill Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            🎬 Studio / Team
          </span>
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
            {studio}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            🗓️ Release Window
          </span>
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--gold)" }}>
            {timing}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            📺 Where to Watch
          </span>
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
            {platform}
          </span>
        </div>
      </div>

      {/* Takeaway Bullets */}
      <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {takeaways.map((item, idx) => (
          <li key={idx} style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
