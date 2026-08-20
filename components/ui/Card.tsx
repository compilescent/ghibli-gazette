"use client"

import { forwardRef, type HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined"
  hover?: boolean
  padding?: "none" | "sm" | "md" | "lg"
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", hover = false, padding = "md", className = "", children, ...props }, ref) => {
    const variants = {
      default: "bg-bg-card border border-border",
      elevated: "bg-bg-elevated border border-border shadow-card",
      outlined: "bg-transparent border-2 border-border-light",
    }

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    }

    const hoverStyles = hover
      ? "transition-all duration-200 hover:border-border-light hover:-translate-y-1 hover:shadow-hover"
      : ""

    return (
      <div
        ref={ref}
        className={`${variants[variant]} ${paddings[padding]} rounded-card ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = "", children, ...props }, ref) => (
    <h3 ref={ref} className="font-display text-lg font-bold text-text-primary ${className}" {...props}>
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", children, ...props }, ref) => (
    <p ref={ref} className="text-text-secondary text-sm mt-1 ${className}" {...props}>
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className="flex items-center gap-2 pt-4 border-t border-border ${className}" {...props}>
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"