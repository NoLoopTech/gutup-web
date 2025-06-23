"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import QuoteTab from "./QuoteTab"
import FoodTab from "./FoodTab"
import RecipeTab from "./RecipeTab"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface Props {
  open: boolean
  onClose: () => void
}

// Tab option
interface TabOption {
  value: LayoutOption
  label: string
}

type LayoutOption = "Quote" | "Food" | "Recipe"

const tabOptions: TabOption[] = [
  { value: "Quote", label: "Quote" },
  { value: "Food", label: "Food" },
  { value: "Recipe", label: "Recipe" }
]

export default function AddMoodFrench({ open, onClose }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<LayoutOption>("Quote")

  return (
    <div>
      {/* Tab Selector using Input */}
      <div>
        <Label className="block mb-2 text-black">Select Layout</Label>
        <Select
          value={activeTab}
          onValueChange={val => {
            setActiveTab(val as LayoutOption)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Layout Type" />
          </SelectTrigger>
          <SelectContent>
            {tabOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Quote" && <QuoteTab />}
        {activeTab === "Food" && <FoodTab />}
        {activeTab === "Recipe" && <RecipeTab />}
      </div>
    </div>
  )
}
