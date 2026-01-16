import { useState, useEffect, useCallback } from "react"
import { searchNavigation } from "@/app/api/search"
import { NavigationSearchResponse } from "@/types/dailyTipTypes"

/**
 * Hook for searching navigation targets with debouncing
 * @param token - Authentication token
 * @param query - Search query string
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 * @param enabled - Whether to enable automatic searching (default: true)
 * @returns Search results, loading state, and error
 */
export const useNavigationSearch = (
  token: string,
  query: string,
  debounceMs: number = 300,
  enabled: boolean = true
) => {
  const [results, setResults] = useState<NavigationSearchResponse>({
    recipes: [],
    foods: [],
    stores: [],
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(
    async (searchQuery: string) => {
      if (!token) {
        setError(new Error("No token provided"))
        return
      }

      if (!searchQuery || searchQuery.length < 2) {
        setResults({
          recipes: [],
          foods: [],
          stores: [],
          total: 0
        })
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await searchNavigation(token, searchQuery)
        setResults(data)
      } catch (err: any) {
        setError(err)
        console.error("Navigation search error:", err)
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  useEffect(() => {
    if (!enabled) return

    const timer = setTimeout(() => {
      search(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, enabled, search])

  return {
    results,
    loading,
    error,
    search: (q: string) => search(q) // Allow manual triggering
  }
}
