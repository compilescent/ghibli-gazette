"use client"

import { forwardRef, type HTMLAttributes } from "react"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "accent" | "success" | "warning" | "info"
  size?: "sm" | "md" | "lg"
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", dot, className = "", children, ...props }, ref) => {
    const variants = {
      default: "bg-accent text-white",
      gold: "bg-gold text-bg-primary",
      accent: "bg-accent-2 text-white",
      success: "bg-ghibli-green text-white",
      warning: "bg-amber-500 text-white",
      info: "bg-blue-500 text-white",
    }

    const sizes = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-2.5 py-1 text-[11px]",
      lg: "px-3 py-1.5 text-xs",
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1 font-bebas uppercase tracking-wider rounded-badge ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"