import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MascotButton from "@/components/MascotButton"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Ghibli Gazette editorial team."
}

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="shell" style={{ flex: 1, maxWidth: "720px", padding: "48px 0 80px" }}>
        <p style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "13px", letterSpacing: "0.2em", color: "var(--accent)", marginBottom: "8px" }}>
          GET IN TOUCH
        </p>
        <h1 style={{ fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          Contact the editorial team
        </h1>
        <div className="prose-article" style={{ marginTop: "24px" }}>
          <p>
            Have a story tip, a correction, or a recommendation? We'd love to hear from you.
          </p>
          <h2>Ways to reach us</h2>
          <ul>
            <li>Story tips and corrections: editorial feedback on the daily news queue.</li>
            <li>Press &amp; partnerships: questions about coverage and sources.</li>
            <li>Reader questions: anything anime, manga, or Ghibli related.</li>
          </ul>
          <p>
            The fastest way to stay in touch is the <a href="/#latest-stories-section" style={{ color: "var(--accent)", textDecoration: "underline" }}>daily newsletter</a>.
            For everything else, reach us through the social links configured in the admin settings.
          </p>
        </div>
      </div>
      <Footer />
      <MascotButton />
    </main>
  )
}