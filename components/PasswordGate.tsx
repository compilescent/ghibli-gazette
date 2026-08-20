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
        background: "var(--bg-primary)",
        padding: "20px"
      }}
    >
      <form
        onSubmit={submit}
        className={shaking ? "shake" : ""}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}
        >
          <span style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontSize: "20px", color: "#fff" }}>
            GG
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "28px",
            letterSpacing: "0.1em",
            color: "var(--text-primary)",
            marginBottom: "8px"
          }}
        >
          ADMIN ACCESS
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          Enter password to manage Ghibli Gazette
        </p>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="input"
          placeholder="Password"
          autoFocus
          style={{ marginBottom: "12px", textAlign: "center" }}
        />
        {error && <p style={{ fontSize: "13px", color: "#ff6b6b", marginBottom: "12px", fontWeight: 600 }}>{error}</p>}
        <button
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          type="submit"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </main>
  )
}
