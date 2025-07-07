"use client"

import React from "react"
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
import { type translationsTypes } from "@/types/moodsTypes"
import { useMoodStore } from "@/stores/useMoodStore"

// Tab option
type LayoutOption = "Quote" | "Food" | "Recipe"

const tabOptions: { value: LayoutOption; label: string }[] = [
  { value: "Quote", label: "Quote" },
  { value: "Food", label: "Food" },
  { value: "Recipe", label: "Recipe" }
]

export default function AddMoodPopUp({
  translations,
  onClose,
  addMood,
  isLoading,
  userName
}: {
  translations: translationsTypes
  onClose: () => void
  addMood: () => void
  isLoading: boolean
  userName: string
}): JSX.Element {
  const { activeTab, setActiveTab } = useMoodStore()

  return (
    <div>
      {/* Tab Selector */}
      <div>
        <Label className="block mb-2 text-black">
          {translations.selectLayout}
        </Label>
        <Select
          value={activeTab}
          onValueChange={(val: string) => {
            setActiveTab(val as LayoutOption)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={translations.selectLayoutType} />
          </SelectTrigger>
          <SelectContent>
            {tabOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {translations[
                  opt.value.toLowerCase() as keyof translationsTypes
                ] || opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Quote" && (
          <QuoteTab
            translations={translations}
            onClose={onClose}
            addQuoteMood={addMood}
            isLoading={isLoading}
          />
        )}
        {activeTab === "Food" && (
          <FoodTab
            translations={translations}
            onClose={onClose}
            addFoodMood={addMood}
            isLoading={isLoading}
            userName={userName}
          />
        )}
        {activeTab === "Recipe" && (
          <RecipeTab
            translations={translations}
            onClose={onClose}
            addRecipeMood={addMood}
            isLoading={isLoading}
            userName={userName}
          />
        )}
      </div>
    </div>
  )
}
