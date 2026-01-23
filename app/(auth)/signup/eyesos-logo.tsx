"use client"

import { cn } from "@/lib/utils"

interface EyeSosLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function EyeSosLogo({ className, size = "md" }: EyeSosLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-red-600 shadow-lg",
          sizeClasses[size]
        )}
      >
        {/* Eye icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-2/3 h-2/3 text-white"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <span className={cn("font-bold tracking-tight", textSizes[size])}>
        <span className="text-red-500">Eye</span>
        <span className="text-foreground">SOS</span>
      </span>
    </div>
  )
}
