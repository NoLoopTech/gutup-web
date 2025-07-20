"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import React, { useEffect, useState, type KeyboardEvent } from "react"
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
  suggestions?: Array<{ tagName: string; tagNameFr: string }>
  activeLang?: "en" | "fr"
  onSelectSuggestion?: (benefit: { tagName: string; tagNameFr: string }) => void
  onRemoveBenefit?: (benefit: { tagName: string; tagNameFr: string }) => void
  onAddNewBenefit?: (
    benefit: string
  ) => Promise<{ tagName: string; tagNameFr: string }>
}

export default function LableInput({
  title,
  placeholder,
  benefits = [],
  name,
  disable,
  width = "w-64",
  onChange,
  onBlur,
  suggestions = [],
  activeLang = "en",
  onSelectSuggestion,
  onRemoveBenefit,
  onAddNewBenefit
}: Props): React.ReactElement {
  const {
    setValue,
    formState: { errors },
    trigger
  } = useFormContext()
  const [value, setValueState] = useState("")
  const [items, setItems] = useState<string[]>(benefits)

  useEffect(() => {
    setItems(benefits)
  }, [benefits])

  const updateItems = (updatedItems: string[]): void => {
    setItems(updatedItems)
    setValue(name, updatedItems)
    if (onChange) {
      onChange(updatedItems)
    }
    void trigger(name)
  }

  const addItem = async (suggestion?: {
    tagName: string
    tagNameFr: string
  }): Promise<void> => {
    let newItem = value.trim()
    let matchedSuggestion = suggestion

    // If not clicked from suggestion, try to find a match
    if (!matchedSuggestion) {
      matchedSuggestion = suggestions.find(
        s =>
          (activeLang === "en" &&
            s.tagName.toLowerCase() === newItem.toLowerCase()) ||
          (activeLang === "fr" &&
            s.tagNameFr.toLowerCase() === newItem.toLowerCase())
      )
    }

    // If not in suggestions, treat as new benefit
    if (!matchedSuggestion && newItem.length > 0 && onAddNewBenefit) {
      matchedSuggestion = await onAddNewBenefit(newItem)
    }

    // Only allow adding if matchedSuggestion exists
    if (!matchedSuggestion) {
      setValueState("") // Clear input if not valid
      return
    }

    newItem =
      activeLang === "en"
        ? matchedSuggestion.tagName
        : matchedSuggestion.tagNameFr

    if (!items.includes(newItem) && items.length < 6) {
      const updatedItems = [...items, newItem]
      updateItems(updatedItems)
      if (onSelectSuggestion) {
        onSelectSuggestion(matchedSuggestion)
      }
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
      void addItem()
    }
  }

  // Filter suggestions based on input and language
  const filteredAllBenefits = suggestions.filter(
    tag =>
      (activeLang === "en"
        ? tag.tagName.toLowerCase().includes(value.toLowerCase())
        : tag.tagNameFr.toLowerCase().includes(value.toLowerCase())) &&
      !items.includes(activeLang === "en" ? tag.tagName : tag.tagNameFr)
  )

  return (
    <div className="col-span-1 w-full sm:col-span-2 md:col-span-1">
      <Label className="block mb-1 text-black">{title}</Label>
      {!disable && (
        <div className="relative">
          <Input
            placeholder={placeholder}
            className={`mb-2 ${width}`}
            value={value}
            onChange={e => {
              setValueState(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            disabled={disable}
          />
          {value && filteredAllBenefits.length > 0 && (
            <div className="overflow-auto absolute z-50 mt-1 w-full max-h-48 bg-white rounded-md border border-gray-300 shadow-md">
              {filteredAllBenefits.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={async () => {
                    await addItem(item)
                  }}
                >
                  {activeLang === "en" ? item.tagName : item.tagNameFr}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          // Find the suggestion object for removal
          const suggestion = suggestions.find(
            s => s.tagName === item || s.tagNameFr === item
          ) ?? { tagName: item, tagNameFr: item } // fallback for custom benefits

          return (
            <div
              key={item}
              className="flex items-center px-2 py-1 max-w-full text-sm text-black bg-white rounded border border-gray-300 shadow-sm"
            >
              <span className="mr-1">{item}</span>
              <button
                type="button"
                onClick={() => {
                  removeItem(item)
                  // Always call onRemoveBenefit with both EN and FR
                  if (onRemoveBenefit) {
                    onRemoveBenefit(suggestion)
                  }
                }}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>
      {errors[name]?.message && (
        <div className="text-sm text-red-500">
          {String(errors[name]?.message)}
        </div>
      )}
    </div>
  )
}
