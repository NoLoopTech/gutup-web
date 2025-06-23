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
import { translationsTypes } from "@/types/moodsTypes"

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

export default function AddMoodPopUp({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const [activeTab, setActiveTab] = useState<LayoutOption>("Quote")

  return (
    <div>
      {/* Tab Selector using Input */}
      <div>
        <Label className="block mb-2 text-black">
          {translations.selectLayout}
        </Label>
        <Select
          value={activeTab}
          onValueChange={val => {
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
                ] || opt.label}{" "}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Quote" && <QuoteTab translations={translations} />}
        {activeTab === "Food" && <FoodTab translations={translations} />}
        {activeTab === "Recipe" && <RecipeTab translations={translations} />}
      </div>
    </div>
  )
}
