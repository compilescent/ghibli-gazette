"use client"

import { useEffect, useRef } from "react"

/**
 * Accessible dialog behavior: traps focus, restores focus on close, closes on Escape.
 * Returns a ref to attach to the dialog element.
 */
export function useDialog(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const dialog = dialogRef.current
    if (dialog) {
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== "Tab") return

      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement)

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen, onClose])

  return dialogRef
}