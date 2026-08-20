import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/posts"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const NEWSLETTER_FROM = process.env.NEWSLETTER_FROM || "Ghibli Gazette <newsletter@ghibli-gazette.vercel.app>"

async function sendConfirmationEmail(email: string, token: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email send")
    return { success: true, simulated: true }
  }

  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://ghibli-gazette.vercel.app"}/api/newsletter/confirm?token=${token}`

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NEWSLETTER_FROM,
        to: [email],
        subject: "Confirm your subscription to Ghibli Gazette",
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0A0A0F; color: #F0EEE8;">
              <div style="background: #16161F; border: 1px solid #2A2A38; border-radius: 12px; padding: 40px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <span style="font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #E8643A; letter-spacing: 0.02em;">GHIBLI</span>
                  <span style="font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #F0EEE8; letter-spacing: 0.02em;">GAZETTE</span>
                </div>
                <h1 style="font-family: 'Libre Baskerville', Georgia, serif; font-size: 28px; color: #fff; margin-bottom: 16px; text-align: center;">
                  Confirm your subscription
                </h1>
                <p style="color: #9896A8; line-height: 1.7; margin-bottom: 24px; text-align: center;">
                  Thanks for subscribing! Click the button below to confirm your email address and start receiving our weekly anime & Ghibli newsletter.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${confirmUrl}" style="display: inline-block; background: #E8643A; color: #fff; padding: 16px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-family: 'Inter', sans-serif;">
                    Confirm Subscription
                  </a>
                </div>
                <p style="color: #5A5868; font-size: 14px; text-align: center; border-top: 1px solid #2A2A38; padding-top: 24px;">
                  If you didn't sign up for this, you can safely ignore this email.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Resend error: ${JSON.stringify(error)}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return { success: false, error: String(error) }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await redis.get(`newsletter:${normalizedEmail}`)

    if (existing && typeof existing === "object" && (existing as any).status === "confirmed") {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    const token = crypto.randomUUID()
    await redis.set(`newsletter:${normalizedEmail}`, {
      status: "pending",
      token,
      createdAt: new Date().toISOString(),
    })

    await sendConfirmationEmail(normalizedEmail, token)

    return NextResponse.json({ success: true, message: "Confirmation email sent" })
  } catch (error) {
    console.error("Newsletter subscribe error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}