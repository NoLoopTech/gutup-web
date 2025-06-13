"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import QuoteTab from "./QuoteTab"
import IngredientsTab from "./IngredientsTab"
import RecipeTab from "./RecipeTab"

interface Props {
  open: boolean
  onClose: () => void
}

// Tab option
interface TabOption {
  value: LayoutOption;
  label: string;
}

type LayoutOption = "Quote" | "Ingredients" | "Recipe"

const tabOptions: TabOption[] = [
  { value: "Quote", label: "Quote" },
  { value: "Ingredients", label: "Ingredients" },
  { value: "Recipe", label: "Recipe" },
]

export default function AddMoodPopUp({ open, onClose }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<LayoutOption>("Quote")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`div::-webkit-scrollbar { width: 0px; background: transparent; }`}
          </style>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Add New Mood</h2>
          </div>

          {/* Tab Selector using Input */}
          <div className="mb-4 w-100">
            <Label className="text-black mb-2 block">Select Layout</Label>
            <Input
              className="w-full"
              options={tabOptions}
              placeholder="Select Layout Type"
              value={activeTab}
              onChange={(e) => { setActiveTab(e.target.value as LayoutOption); }}
            />
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "Quote" && <QuoteTab />}
            {activeTab === "Ingredients" && <IngredientsTab />}
            {activeTab === "Recipe" && <RecipeTab />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
