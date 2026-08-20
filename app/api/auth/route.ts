import { NextRequest, NextResponse } from "next/server"
import { getAdminPassword, getSiteSettings, setAdminPassword, setSiteSettings } from "@/lib/posts"
import type { SiteSettings } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json({ settings })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string }
  const stored = await getAdminPassword()
  return NextResponse.json({ success: body.password === stored })
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as {
    currentPassword?: string
    newPassword?: string
    settings?: SiteSettings
  }

  const stored = await getAdminPassword()
  if (body.currentPassword !== stored) {
    return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 })
  }

  if (body.newPassword && body.newPassword.length >= 6) {
    await setAdminPassword(body.newPassword)
  }

  if (body.settings) {
    await setSiteSettings({
      instagram: body.settings.instagram ?? "",
      discord: body.settings.discord ?? "",
      twitter: body.settings.twitter ?? ""
    })
  }

  return NextResponse.json({ success: true })
}
