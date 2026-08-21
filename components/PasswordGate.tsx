"use client"

import { FormEvent, ReactNode, useEffect, useState } from "react"

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthed(sessionStorage.getItem("gz_auth") === "true")
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    })
    const result = (await response.json()) as { success: boolean }
    setLoading(false)

    if (result.success) {
      sessionStorage.setItem("gz_auth", "true")
      setAuthed(true)
      return
    }

    setError("Incorrect password")
    setShaking(true)
    setTimeout(() => setShaking(false), 450)
  }

  if (authed) return <>{children}</>

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        padding: "20px"
      }}
    >
      <form
        onSubmit={submit}
        className={shaking ? "shake" : ""}
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "32px", color: "var(--text)", letterSpacing: "0.03em" }}>
            GHIBLI
          </span>
          <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "32px", color: "var(--red)", letterSpacing: "0.03em", marginLeft: "6px" }}>
            GAZETTE
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)", fontSize: "13px", color: "var(--text3)", marginBottom: "24px" }}>
          Staff Access Only
        </p>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          autoFocus
          style={{
            width: "100%",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "10px 14px",
            color: "var(--text)",
            fontFamily: "var(--font-inter, system-ui, sans-serif)",
            fontSize: "14px",
            outline: "none",
            marginBottom: "12px",
            transition: "border-color 0.15s ease"
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "var(--red)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        />
        {error && <p style={{ fontSize: "13px", color: "var(--red)", marginBottom: "12px", fontWeight: 600 }}>{error}</p>}
        <button
          disabled={loading}
          type="submit"
          style={{
            width: "100%",
            background: "var(--red)",
            color: "#fff",
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "16px",
            letterSpacing: "0.1em",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--red2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--red)"}
        >
          {loading ? "Verifying..." : "SIGN IN"}
        </button>
      </form>
    </main>
  )
}