import Link from "next/link"

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "40px 20px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          fontSize: "clamp(64px, 16vw, 120px)",
          lineHeight: 1,
          marginBottom: "8px",
          animation: "floatSoft 3s ease-in-out infinite"
        }}
        aria-hidden="true"
      >
        🍥
      </div>
      <p
        style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "clamp(48px, 10vw, 80px)",
          letterSpacing: "0.05em",
          color: "var(--accent)",
          margin: 0
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)",
          fontSize: "clamp(20px, 4vw, 30px)",
          color: "var(--text-primary)",
          margin: "8px 0 12px"
        }}
      >
        Lost in the spirit forest
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--text-secondary)",
          maxWidth: "440px",
          lineHeight: 1.7,
          margin: "0 0 28px"
        }}
      >
        The page you're looking for wandered off the trail. Maybe a soot sprite stole it — let's get you back home.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary">
          ← Back to Home
        </Link>
        <Link href="/archive" className="btn btn-outline">
          Browse All Stories
        </Link>
      </div>
      <style>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </main>
  )
}