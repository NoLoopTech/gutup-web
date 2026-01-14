"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Search, Loader2, ExternalLink } from "lucide-react"
import { useNavigationSearch } from "@/query/hooks/useNavigationSearch"
import { NavigationSearchResult } from "@/types/dailyTipTypes"
import { cn } from "@/lib/utils"

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
  allowExternal?: boolean
  language?: "en" | "fr"
}

export default function NavigationSearch({
  token,
  value,
  onSelect,
  placeholder = "Search recipes, foods, stores...",
  label = "Navigation Target",
  disabled = false,
  allowExternal = true,
  language = "en"
}: NavigationSearchProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [mode, setMode] = useState<"search" | "external">("search")
  const [externalUrl, setExternalUrl] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { results, loading } = useNavigationSearch(
    token,
    searchQuery,
    300,
    mode === "search" && showResults
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const handleSelectResult = (result: NavigationSearchResult) => {
    onSelect(result)
    setSearchQuery("")
    setShowResults(false)
  }

  const handleClear = () => {
    onSelect(null)
    setSearchQuery("")
    setExternalUrl("")
  }

  const handleExternalUrlSubmit = () => {
    if (externalUrl && externalUrl.trim()) {
      onSelect({
        type: "external" as any,
        id: 0,
        name: externalUrl,
        slug: externalUrl
      })
      setExternalUrl("")
    }
  }

  const hasResults = results.total > 0
  const hasSelection = value?.type && value?.target

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {allowExternal && (
          <div className="flex gap-1">
            <Button
              type="button"
              variant={mode === "search" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("search")}
              disabled={disabled}
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
            <Button
              type="button"
              variant={mode === "external" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("external")}
              disabled={disabled}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              External URL
            </Button>
          </div>
        )}
      </div>

      {mode === "search" ? (
        <>
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
              onFocus={() => setShowResults(true)}
              disabled={disabled}
              className="pr-10"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchQuery.length >= 2 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : hasResults ? (
                <div className="py-2">
                  {results.recipes.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                        Recipes
                      </div>
                      {results.recipes.map(recipe => (
                        <button
                          key={`recipe-${recipe.id}`}
                          type="button"
                          onClick={() => handleSelectResult(recipe)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm">
                            {language === "fr" && recipe.nameFR
                              ? recipe.nameFR
                              : recipe.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Recipe • ID: {recipe.id}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.foods.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                        Foods
                      </div>
                      {results.foods.map(food => (
                        <button
                          key={`food-${food.id}`}
                          type="button"
                          onClick={() => handleSelectResult(food)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm">
                            {language === "fr" && food.nameFR
                              ? food.nameFR
                              : food.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Food • ID: {food.id}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.stores.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                        Stores
                      </div>
                      {results.stores.map(store => (
                        <button
                          key={`store-${store.id}`}
                          type="button"
                          onClick={() => handleSelectResult(store)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm">
                            {store.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Store • ID: {store.id}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={externalUrl}
              onChange={e => setExternalUrl(e.target.value)}
              disabled={disabled}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleExternalUrlSubmit}
              disabled={disabled || !externalUrl.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Selected Item Display */}
      {hasSelection && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-900">
              {value.type === "external"
                ? "External URL"
                : value.type?.toUpperCase()}
            </div>
            <div className="text-sm text-blue-700 truncate">
              {value.name || value.target}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
