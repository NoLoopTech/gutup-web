import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import React from "react"

interface SearchBarProps {
  title: string
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  title,
  placeholder = "Search..."
}) => {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="search" className="text-sm font-medium text-black">
        {title}
      </Label>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input id="search" placeholder={placeholder} className="pl-10 w-full" />
      </div>
    </div>
  )
}

export default SearchBar
