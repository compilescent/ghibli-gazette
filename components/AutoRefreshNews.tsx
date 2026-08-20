"use client"

import { useEffect } from "react"

/**
 * Keeps the site's news fresh automatically: once per browser session it
 * pings the crawl endpoint, which only crawls if the last crawl is stale
 * (see API-side guard). Silent and non-blocking.
 */
export default function AutoRefreshNews() {
  useEffect(() => {
    const sessionKey = "gg_news_refreshed"

    const trigger = async () => {
      try {
        if (sessionStorage.getItem(sessionKey)) return
        sessionStorage.setItem(sessionKey, "1")
      } catch {
        // sessionStorage unavailable — rely on the API-side stale guard
      }
      try {
        await fetch("/api/queue/crawl", { method: "POST" })
      } catch {
        // network hiccup — the daily cron still covers freshness
      }
    }

    const timer = setTimeout(trigger, 3000)
    return () => clearTimeout(timer)
  }, [])

  return null
}