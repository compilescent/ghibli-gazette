export default function LoadingSprites({ label = "Loading stories" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" style={{ minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "var(--bg-primary)" }}>
      <div className="loading-sprites" style={{ padding: 0 }}>
        <span />
        <span />
        <span />
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
        {label}…
      </p>
    </div>
  )
}