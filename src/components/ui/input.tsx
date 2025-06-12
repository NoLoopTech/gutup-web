"use client"
// components/ui/Input.tsx

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import React, { useState } from "react"

interface Option {
  value: string
  label: string
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options?: Option[]
  placeholder?: string // Supports placeholder as a prop
}

const Input = React.forwardRef<
  HTMLInputElement | HTMLSelectElement,
  InputProps
>(({ className, type = "text", options, placeholder, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState("")

  if (options && options.length > 0) {
    return (
      <div className="relative w-full">
        <select
          ref={ref as React.ForwardedRef<HTMLSelectElement>}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none",
            className
          )}
          value={selected}
          onChange={e => {
            setSelected(e.target.value)
          }}
          onFocus={() => {
            setIsOpen(true)
          }}
          onBlur={() => {
            setIsOpen(false)
          }}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {/*  Placeholder Option */}
          <option value="" disabled hidden>
            {placeholder ?? "Select an option"}
          </option>

          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
    )
  }

  // Fallback to regular input
  return (
    <input
      type={type}
      ref={ref as React.ForwardedRef<HTMLInputElement>}
      placeholder={placeholder}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"
export { Input }
