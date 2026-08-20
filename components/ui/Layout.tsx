"use client"

import { forwardRef, type HTMLAttributes } from "react"

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", className = "", children, ...props }, ref) => {
    const sizes = {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    }

    return (
      <div
        ref={ref}
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "bordered"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

export const Section = forwardRef<HTMLSectionElement, SectionProps>(
  ({ variant = "default", padding = "lg", className = "", children, ...props }, ref) => {
    const variants = {
      default: "bg-bg-primary",
      muted: "bg-bg-secondary",
      bordered: "bg-bg-primary border-y border-border",
    }

    const paddings = {
      none: "",
      sm: "py-6",
      md: "py-10",
      lg: "py-16",
      xl: "py-24",
    }

    return (
      <section ref={ref} className={`${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
        {children}
      </section>
    )
  }
)

Section.displayName = "Section"

export const SectionHeader = ({
  label,
  title,
  description,
  action,
  className = "",
}: {
  label?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) => (
  <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 ${className}`}>
    <div>
      {label && (
        <span className="font-bebas text-xs tracking-widest text-accent uppercase mb-2 block">
          {label}
        </span>
      )}
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-text-secondary max-w-xl">{description}</p>
      )}
    </div>
    {action && <div className="flex-shrink-0 mt-4 sm:mt-0">{action}</div>}
  </div>
)