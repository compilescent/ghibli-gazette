import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/posts"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0A0A0F; color: #F0EEE8; text-align: center;">
          <div style="background: #16161F; border: 1px solid #2A2A38; border-radius: 12px; padding: 40px;">
            <h1 style="font-family: 'Libre Baskerville', Georgia, serif; font-size: 28px; color: #fff; margin-bottom: 16px;">Invalid Link</h1>
            <p style="color: #9896A8; line-height: 1.7;">This confirmation link is invalid or has expired.</p>
          </div>
        </body>
      </html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    )
  }

  // Find the subscription by token
  const keys = await redis.keys("newsletter:*")
  let foundEmail: string | null = null

  for (const key of keys) {
    const data = await redis.get(key)
    if (data && typeof data === "object" && (data as any).token === token) {
      foundEmail = key.replace("newsletter:", "")
      break
    }
  }

  if (!foundEmail) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0A0A0F; color: #F0EEE8; text-align: center;">
          <div style="background: #16161F; border: 1px solid #2A2A38; border-radius: 12px; padding: 40px;">
            <h1 style="font-family: 'Libre Baskerville', Georgia, serif; font-size: 28px; color: #fff; margin-bottom: 16px;">Link Expired</h1>
            <p style="color: #9896A8; line-height: 1.7;">This confirmation link has expired or was already used.</p>
          </div>
        </body>
      </html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    )
  }

  await redis.set(`newsletter:${foundEmail}`, {
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
  })

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0A0A0F; color: #F0EEE8; text-align: center;">
        <div style="background: #16161F; border: 1px solid #2A2A38; border-radius: 12px; padding: 40px;">
          <div style="font-size: 64px; margin-bottom: 24px;">✓</div>
          <h1 style="font-family: 'Libre Baskerville', Georgia, serif; font-size: 28px; color: #fff; margin-bottom: 16px;">You're subscribed!</h1>
          <p style="color: #9896A8; line-height: 1.7; margin-bottom: 24px;">
            Welcome to Ghibli Gazette. You'll receive our weekly newsletter with the latest Studio Ghibli news, anime reviews, and release updates.
          </p>
          <a href="https://ghibli-gazette.vercel.app" style="display: inline-block; color: #E8643A; font-weight: 600; text-decoration: none;">
            Read latest stories →
          </a>
        </div>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  )
}