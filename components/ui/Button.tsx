"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, className = "", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      primary: "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md",
      outline: "bg-transparent border border-border-light text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-elevated",
      ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"