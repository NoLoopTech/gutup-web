"use client"

import React from "react"
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
import EditBasicLayoutTab from "./EditBasicLayoutTab"
import EditShopPromotionTab from "./EditShopPromotionTab"
import EditVideoTipTab from "./EditVideoTipTab"

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

export default function EditDailyTipPopUp({
  translations,
  onClose,
  token,
  userName,
  editDailyTip,
  isLoading
}: {
  translations: translationsTypes
  onClose: () => void
  token: string
  userName: string
  editDailyTip: () => void
  isLoading: boolean
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
          disabled
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
          <EditBasicLayoutTab
            translations={translations}
            onClose={onClose}
            editDailyTip={editDailyTip}
            userName={userName}
            isLoading={isLoading}
          />
        )}
        {activeTab === "shopPromote" && (
          <EditShopPromotionTab
            translations={translations}
            onClose={onClose}
            token={token}
            userName={userName}
            editDailyTip={editDailyTip}
            isLoading={isLoading}
          />
        )}
        {activeTab === "videoForm" && (
          <EditVideoTipTab
            translations={translations}
            onClose={onClose}
            editDailyTip={editDailyTip}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
