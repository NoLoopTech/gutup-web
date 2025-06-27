"use client"

import React, { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface Props {
  title: string
  placeholder: string
  benefits?: string[]
  name: string
  disable?: boolean
  width?: string
  onChange?: (items: string[]) => void
  onBlur?: () => void
}

export default function LableInput({
  title,
  placeholder,
  benefits = [],
  name,
  disable,
  width = "w-64",
  onChange,
  onBlur
}: Props): React.ReactElement {
  const {
    setValue,
    formState: { errors },
    trigger
  } = useFormContext()
  const [value, setValueState] = useState("")
  const [items, setItems] = useState<string[]>(benefits)

  const updateItems = (updatedItems: string[]): void => {
    setItems(updatedItems)
    setValue(name, updatedItems)
    if (onChange) {
      onChange(updatedItems)
    }
    void trigger(name)
  }

  const addItem = (): void => {
    const trimmed = value.trim()
    if (!trimmed) return

    // Prevent duplicates and max length of 6 items
    if (!items.includes(trimmed) && items.length < 6) {
      const updatedItems = [...items, trimmed]
      updateItems(updatedItems)
    }

    setValueState("") // Reset input field
  }

  const removeItem = (benefit: string): void => {
    const updatedItems = items.filter(b => b !== benefit)
    updateItems(updatedItems)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="col-span-1 w-full sm:col-span-2 md:col-span-1">
      <Label className="block mb-1 text-black">{title}</Label>

      {!disable && (
        <Input
          placeholder={placeholder}
          className={`mb-2 ${width}`}
          value={value}
          onChange={e => {
            setValueState(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          disabled={disable}
          onBlur={onBlur}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <div
            key={item}
            className="flex items-center px-2 py-1 max-w-full text-sm text-black bg-white rounded border border-gray-300 shadow-sm"
          >
            <span className="mr-1">{item}</span>
            <button
              type="button"
              onClick={() => {
                removeItem(item)
              }}
              className="text-gray-500 hover:text-red-500 focus:outline-none"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Display error message if no labels are entered */}
      {errors[name]?.message && (
        <div className="text-sm text-red-500">
          {String(errors[name]?.message)}
        </div>
      )}
    </div>
  )
}
