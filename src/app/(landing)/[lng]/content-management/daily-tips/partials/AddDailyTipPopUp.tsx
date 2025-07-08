"use client"

import React, { useState } from "react"
import VideoTipTab from "./VideoTipTab"
import BasicLayoutTab from "./BasicLayoutTab"
import ShopPromotionTab from "./ShopPromotionTab"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { type translationsTypes } from "@/types/dailyTipTypes"
import { useDailyTipStore } from "@/stores/useDailyTipStore"

// Tab option
interface TabOption {
  value: LayoutOption
  label: string
}

type LayoutOption = "basicForm" | "shopPromote" | "videoForm"

const tabOptions: TabOption[] = [
  { value: "basicForm", label: "Basic Layout" },
  { value: "shopPromote", label: "Shop Promotion" },
  { value: "videoForm", label: "Video Tip" }
]

export default function AddDailyTipPopUp({
  translations,
  onClose,
  token,
  userName,
  addDailyTip
}: {
  translations: translationsTypes
  onClose: () => void
  token: string
  userName: string
  addDailyTip: () => void
}): JSX.Element {
  const { activeTab, setActiveTab } = useDailyTipStore()

  return (
    <div>
      {/* Tab Selector using Input */}
      <div className="mb-4 w-[25.4rem] relative z-20">
        <Label className="block mb-1 text-black">
          {translations.layoutSelection}
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
                {translations[opt.value as keyof translationsTypes] ||
                  opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "basicForm" && (
          <BasicLayoutTab
            translations={translations}
            onClose={onClose}
            addDailyTip={addDailyTip}
            userName={userName}
          />
        )}
        {activeTab === "shopPromote" && (
          <ShopPromotionTab
            translations={translations}
            onClose={onClose}
            token={token}
            userName={userName}
            addDailyTip={addDailyTip}
          />
        )}
        {activeTab === "videoForm" && (
          <VideoTipTab
            translations={translations}
            onClose={onClose}
            addDailyTip={addDailyTip}
          />
        )}
      </div>
    </div>
  )
}
