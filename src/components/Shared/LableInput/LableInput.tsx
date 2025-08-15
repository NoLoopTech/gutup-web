"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import React, { useEffect, useState, type KeyboardEvent } from "react"
import { toast } from "sonner"

interface Props {
  title: string | undefined
  placeholder: string | undefined
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
  maxBenefitsCount?: number
}

export default function LableInput({
  title,
  placeholder,
  benefits = [],
  name,
  disable,
  width = "w-64",
  suggestions = [],
  activeLang = "en",
  onSelectSuggestion,
  onRemoveBenefit,
  onAddNewBenefit,
  maxBenefitsCount = 6,
  ...props
}: Props): React.ReactElement {
  const [value, setValueState] = useState("")
  const [items, setItems] = useState<string[]>(benefits)

  // Update items when benefits prop changes
  useEffect(() => {
    setItems(benefits)
  }, [benefits])

  const updateItems = (updatedItems: string[]): void => {
    setItems(updatedItems)
    if (props.onChange) {
      props.onChange(updatedItems)
    }
  }

  const addItem = async (suggestion?: {
    tagName: string
    tagNameFr: string
  }): Promise<void> => {
    if (disable) return // Don't add items if disabled

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

    // Check if max benefits count has been reached
    if (items.length >= maxBenefitsCount) {
      toast.error(`You can only add a maximum of ${maxBenefitsCount} benefits.`)
      return
    }

    // Check for duplicate before adding
    if (items.includes(newItem)) {
      toast.error("This benefit is already added!")
      return
    }

    // If we have a matched suggestion and onSelectSuggestion handler, use it
    if (matchedSuggestion && onSelectSuggestion) {
      onSelectSuggestion(matchedSuggestion)
      setValueState("") // Clear input
      toast.success(
        `Benefit '${matchedSuggestion.tagName}' added successfully!`
      )
      return
    }

    // If not in suggestions and we have onAddNewBenefit, create new
    if (!matchedSuggestion && newItem.length > 0 && onAddNewBenefit) {
      try {
        matchedSuggestion = await onAddNewBenefit(newItem)
        if (matchedSuggestion && onSelectSuggestion) {
          onSelectSuggestion(matchedSuggestion)
          setValueState("")
          toast.success(
            `Benefit '${matchedSuggestion.tagName}' added successfully!`
          )
          return
        }
      } catch (error) {
        console.error("Error adding new benefit:", error)
      }
    }

    // Fallback to basic behavior if no special handlers
    if (!onSelectSuggestion && matchedSuggestion) {
      newItem =
        activeLang === "en"
          ? matchedSuggestion.tagName
          : matchedSuggestion.tagNameFr

      if (!items.includes(newItem) && items.length < maxBenefitsCount) {
        const updatedItems = [...items, newItem]
        updateItems(updatedItems)
        toast.success(`Benefit '${newItem}' added successfully!`)
      }
    }

    setValueState("") // Reset input field
  }

  const removeItem = (benefit: string): void => {
    if (disable) return // Don't remove items if disabled

    // Find the suggestion object for removal
    const suggestion = suggestions.find(
      s => s.tagName === benefit || s.tagNameFr === benefit
    ) ?? { tagName: benefit, tagNameFr: benefit } // fallback for custom benefits

    // If we have onRemoveBenefit handler, use it
    if (onRemoveBenefit) {
      onRemoveBenefit(suggestion)
      toast.success(`Benefit '${benefit}' removed successfully!`)
    } else {
      // Fallback to basic removal
      const updatedItems = items.filter(b => b !== benefit)
      updateItems(updatedItems)
      toast.success(`Benefit '${benefit}' removed successfully!`)
    }
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
          {activeLang === "en" && (
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
          )}
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
              {!disable && (
                <button
                  type="button"
                  onClick={() => {
                    removeItem(item)
                  }}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
