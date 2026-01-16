"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, Loader2 } from "lucide-react"
import { useNavigationSearch } from "@/query/hooks/useNavigationSearch"
import type { NavigationSearchResult } from "@/types/dailyTipTypes"

interface NavigationSearchProps {
  token: string
  value?: {
    type: string | null
    target: string | null
    name: string | null
  }
  onSelect: (result: NavigationSearchResult | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  language?: "en" | "fr"
}

export default function NavigationSearch({
  token,
  value,
  onSelect,
  placeholder = "Search your page",
  label = "Search Button Navigation",
  disabled = false,
  language = "en"
}: NavigationSearchProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { results, loading } = useNavigationSearch(
    token,
    searchQuery,
    300,
    showResults
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectResult = (result: NavigationSearchResult): void => {
    onSelect(result)
    setSearchQuery("")
    setShowResults(false)
  }

  const handleClear = (): void => {
    onSelect(null)
    setSearchQuery("")
  }

  const hasResults =
    results.recipes.length > 0 ||
    results.foods.length > 0 ||
    results.stores.length > 0
  const hasSelection = value?.type && value?.target

  // Get badge color based on type - matches design with border-radius
  const getTypeBadgeClass = (type: string): string => {
    switch (type) {
      case "recipe":
        return "bg-orange-100 text-orange-600 border border-orange-300"
      case "food":
        return "bg-green-100 text-green-600 border border-green-300"
      case "store":
        return "bg-blue-100 text-blue-600 border border-blue-300"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300"
    }
  }

  // Get badge label
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "recipe":
        return "R"
      case "food":
        return "F"
      case "store":
        return "S"
      default:
        return type.charAt(0).toUpperCase()
    }
  }

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {label && <Label className="block mb-2">{label}</Label>}

      {/* Search Input with icon */}
      {!hasSelection ? (
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => {
              setShowResults(true)
            }}
            disabled={disabled}
            className="pr-10"
          />
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ) : (
        <div className="relative">
          <Input
            type="text"
            value={value.name || value.target || ""}
            readOnly
            className="pr-10 cursor-pointer"
            onClick={handleClear}
          />
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${getTypeBadgeClass(
              value.type || ""
            )}`}
          >
            {getTypeLabel(value.type || "")}
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchQuery.length >= 2 && !hasSelection && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : hasResults ? (
            <div className="p-4">
              {/* Available results heading */}
              <h4
                className="text-sm font-semibold mb-3 sticky top-0 bg-white"
                style={{ fontFamily: "'Raleway', sans-serif", color: "#000" }}
              >
                Available results
              </h4>

              {/* Scrollable results container */}
              <div className="max-h-60 overflow-y-auto">
                {/* Recipes */}
                {results.recipes.length > 0 &&
                  results.recipes.map(recipe => (
                    <button
                      key={`recipe-${recipe.id}`}
                      type="button"
                      onClick={() => {
                        handleSelectResult(recipe)
                      }}
                      className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <span
                        className="text-sm truncate"
                        style={{
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 500,
                          color: "#6BB6F4"
                        }}
                      >
                        {language === "fr" && recipe.nameFR
                          ? recipe.nameFR
                          : recipe.name}
                      </span>
                      <span className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-500">
                        Recipe
                      </span>
                    </button>
                  ))}

                {/* Foods */}
                {results.foods.length > 0 &&
                  results.foods.map(food => (
                    <button
                      key={`food-${food.id}`}
                      type="button"
                      onClick={() => {
                        handleSelectResult(food)
                      }}
                      className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <span
                        className="text-sm truncate"
                        style={{
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 500,
                          color: "#6BB6F4"
                        }}
                      >
                        {language === "fr" && food.nameFR
                          ? food.nameFR
                          : food.name}
                      </span>
                      <span className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-500">
                        Food
                      </span>
                    </button>
                  ))}

                {/* Stores */}
                {results.stores.length > 0 &&
                  results.stores.map(store => (
                    <button
                      key={`store-${store.id}`}
                      type="button"
                      onClick={() => {
                        handleSelectResult(store)
                      }}
                      className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <span
                        className="text-sm truncate"
                        style={{
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 500,
                          color: "#6BB6F4"
                        }}
                      >
                        {store.name}
                      </span>
                      <span className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-500">
                        Shop
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
