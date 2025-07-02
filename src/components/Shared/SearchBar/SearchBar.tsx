import React, { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty
} from "@/components/ui/command"

interface SearchItem {
  id: number
  name: string
}

interface SearchBarProps {
  title: string
  placeholder?: string
  dataList: SearchItem[]
  onSelect: (item: SearchItem) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  title,
  placeholder = "Search...",
  dataList,
  onSelect
}) => {
  const [searchValue, setSearchValue] = useState("")
  const [filteredList, setFilteredList] = useState<SearchItem[]>([])

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredList([])
      return
    }

    const filtered = dataList.filter(item =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    setFilteredList(filtered)
  }, [searchValue, dataList])

  const handleSelect = (item: SearchItem) => {
    onSelect(item)
    setSearchValue("")
    setFilteredList([])
  }

  return (
    <div className="w-full">
      <Label className="block mb-1 text-sm font-medium text-black">
        {title}
      </Label>
      <Command className="rounded-md border shadow-sm">
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder={placeholder}
          className="pl-10"
        />
        <CommandList>
          {filteredList.length > 0 &&
            filteredList.map(item => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => handleSelect(item)}
              >
                {item.name} (ID: {item.id})
              </CommandItem>
            ))}
        </CommandList>
      </Command>
    </div>
  )
}

export default SearchBar
