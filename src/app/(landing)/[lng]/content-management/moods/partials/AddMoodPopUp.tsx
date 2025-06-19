"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
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

export default function AddMoodPopUp({ open, onClose }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<LayoutOption>("Quote")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 space-y-4 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Header */}
          <DialogTitle>Add New Mood</DialogTitle>

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
      </DialogContent>
    </Dialog>
  )
}
