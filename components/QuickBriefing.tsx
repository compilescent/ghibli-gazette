import { type Post } from "@/lib/types"

interface QuickBriefingProps {
  post: Post
}

function inferBriefing(post: Post) {
  const text = (post.title + " " + post.content + " " + (post.excerpt || "")).toLowerCase()

  let studio = "Various Studios"
  if (text.includes("ghibli") || text.includes("miyazaki")) studio = "Studio Ghibli"
  else if (text.includes("mappa")) studio = "MAPPA"
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

  let platform = "Theaters & Global Streaming"
  if (text.includes("netflix")) platform = "Netflix"
  else if (text.includes("crunchyroll")) platform = "Crunchyroll"
  else if (text.includes("disney+")) platform = "Disney+"
  else if (text.includes("hulu")) platform = "Hulu"
  else if (text.includes("theatrical") || text.includes("movie") || text.includes("film")) platform = "Theaters Worldwide"

  let timing = "Confirmed & In Production"
  if (text.includes("october 2026") || text.includes("fall 2026")) timing = "Fall 2026 Season"
  else if (text.includes("winter 2027") || text.includes("january")) timing = "Winter 2027"
  else if (text.includes("august") || text.includes("summer")) timing = "Summer 2026 Broadcast"
  else if (text.includes("2027")) timing = "2027 Release Window"

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
        borderRadius: "6px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--red)"
      }}
      aria-label="30-Second Article Briefing"
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "16px" }}>⚡</span>
        <span
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "13px",
            letterSpacing: "0.12em",
            color: "var(--text)",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            🎬 Studio / Team
          </span>
          <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>
            {studio}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            🗓️ Release Window
          </span>
          <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--red)" }}>
            {timing}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            📺 Where to Watch
          </span>
          <span style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>
            {platform}
          </span>
        </div>
      </div>

      {/* Takeaway Bullets */}
      <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {takeaways.map((item, idx) => (
          <li key={idx} style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "12px", color: "var(--text2)", lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}