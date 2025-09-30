import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"

export interface SearchBarItem {
  id: string | number
  name: string
}

interface SearchBarProps {
  title: string
  placeholder?: string
  dataList?: SearchBarItem[]
  onSelect?: (item: SearchBarItem) => void
  onInputChange?: (value: string) => void
  value?: string
  onSearch?: () => void
  searchLoading?: boolean
  searchButtonLabel?: string
  dropdownOpenTrigger?: number
}

const SearchBar: React.FC<SearchBarProps> = ({
  title,
  placeholder = "Search...",
  dataList = [],
  onSelect,
  onInputChange,
  value,
  onSearch,
  searchLoading = false,
  searchButtonLabel,
  dropdownOpenTrigger
}) => {
  const [internal, setInternal] = useState("")
  const query = value !== undefined ? value : internal
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null) // Reference for input

  // Filter items based on the input query
  const filtered =
    onSelect && query.trim().length > 0
      ? dataList.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
      : []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value
    if (value === undefined) setInternal(v)
    onInputChange?.(v)
    if (onSelect && v.trim().length > 0) setIsOpen(true)
    else setIsOpen(false)
  }

  const handleSelect = (item: SearchBarItem): void => {
    if (value === undefined) setInternal(item.name)
    onInputChange?.(item.name)
    onSelect?.(item)
    setIsOpen(false)
  }

  const handleSearchClick = (): void => {
    onSearch?.()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent): void => {
    // Disable the Enter key
    if (e.key === "Enter") {
      e.preventDefault() // Prevent default action when Enter is pressed
    }
  }

  const handleFocus = (): void => {
    // Attach keydown listener on focus to prevent Enter key
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", handleKeyDown)
    }
  }

  const handleBlur = (): void => {
    // Remove keydown listener when input is blurred
    if (inputRef.current) {
      inputRef.current.removeEventListener("keydown", handleKeyDown)
    }
  }

  // Close dropdown when clicked outside
  useEffect(() => {
    if (!onSelect) return
    const onClick = (e: MouseEvent): void => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("mousedown", onClick)
    }
  }, [onSelect])

  useEffect(() => {
    if (
      dropdownOpenTrigger !== undefined &&
      onSelect &&
      query.trim().length > 0 &&
      filtered.length > 0
    ) {
      setIsOpen(true)
    }
  }, [dropdownOpenTrigger, filtered.length, onSelect, query])

  return (
    <div className="grid gap-2 items-center w-full" ref={wrapperRef}>
      <Label htmlFor="search" className="text-sm font-medium text-black">
        {title}
      </Label>
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
          <Input
            id="search"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus} // Handle focus
            onBlur={handleBlur} // Handle blur
            placeholder={placeholder}
            className={`pl-10 w-full ${onSearch ? "pr-28" : ""}`}
            ref={inputRef}
          />

          {onSelect && isOpen && filtered.length > 0 && (
            <ul className="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-60 text-base bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg">
              {filtered.map(item => (
                <li
                  key={item.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleSelect(item)
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onSearch && (
          <Button
            type="button"
            onClick={handleSearchClick}
            className="shrink-0"
            disabled={searchLoading}
          >
            {searchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              searchButtonLabel ?? "Search"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
