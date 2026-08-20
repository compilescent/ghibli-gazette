import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MascotButton from "@/components/MascotButton"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ghibli Gazette handles your data."
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="shell" style={{ flex: 1, maxWidth: "720px", padding: "48px 0 80px" }}>
        <p style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "13px", letterSpacing: "0.2em", color: "var(--accent)", marginBottom: "8px" }}>
          PRIVACY
        </p>
        <h1 style={{ fontFamily: "var(--font-baskerville, 'Libre Baskerville', Georgia, serif)", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          Privacy Policy
        </h1>
        <div className="prose-article" style={{ marginTop: "24px" }}>
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</p>
          <h2>What we store</h2>
          <p>
            Ghibli Gazette stores only what's needed to run the site: published article data in our content database,
            and the email address you provide when subscribing to the newsletter. Newsletter email addresses are used
            solely to send you the daily briefing and are never sold or shared.
          </p>
          <h2>Local data</h2>
          <p>
            Saved stories (bookmarks) and reading preferences are stored in your browser's local storage and never leave your device.
          </p>
          <h2>Third parties</h2>
          <p>
            We use Vercel for hosting, Upstash for our content database, and Resend for transactional newsletter emails.
            Each of these providers processes data under their own privacy policies.
          </p>
          <h2>Your choices</h2>
          <p>
            You can unsubscribe from the newsletter at any time using the link in any email you receive, or by contacting us.
            You can clear saved stories from the Saved Stories drawer in your browser.
          </p>
        </div>
      </div>
      <Footer />
      <MascotButton />
    </main>
  )
}