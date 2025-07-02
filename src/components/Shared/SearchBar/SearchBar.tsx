// components/Shared/SearchBar/SearchBar.tsx
import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

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
}

const SearchBar: React.FC<SearchBarProps> = ({
  title,
  placeholder = "Search...",
  dataList = [],
  onSelect,
  onInputChange,
  value
}) => {
  const [internal, setInternal] = useState("")
  const query = value !== undefined ? value : internal
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // only filter once there's at least one character
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

  // close on outside click
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

  return (
    <div className="grid w-full items-center gap-2" ref={wrapperRef}>
      <Label htmlFor="search" className="text-sm font-medium text-black">
        {title}
      </Label>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          id="search"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (onSelect && query.trim().length > 0) setIsOpen(true)
          }}
          placeholder={placeholder}
          className="pl-10 w-full"
        />

        {onSelect && isOpen && filtered.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
            {filtered.map(item => (
              <li
                key={item.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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
    </div>
  )
}

export default SearchBar
