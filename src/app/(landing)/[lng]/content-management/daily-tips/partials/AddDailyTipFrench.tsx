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

interface Props {
  open: boolean
  onClose: () => void
}

// Tab option
interface TabOption {
  value: LayoutOption
  label: string
}

type LayoutOption = "BasicLayout" | "ShopPromotion" | "VideoTip"

const tabOptions: TabOption[] = [
  { value: "BasicLayout", label: "Basic Layout" },
  { value: "ShopPromotion", label: "Shop Promotion" },
  { value: "VideoTip", label: "Video Tip" }
]

export default function AddDailyTipFrench({
  open,
  onClose
}: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<LayoutOption>("BasicLayout")

  return (
    <div>
      {/* Tab Selector using Input */}
      <div className="mb-4 w-[25.4rem] relative">
        <Label className="block mb-1 text-black">Layout Selection</Label>
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
        {activeTab === "BasicLayout" && <BasicLayoutTab />}
        {activeTab === "ShopPromotion" && <ShopPromotionTab />}
        {activeTab === "VideoTip" && <VideoTipTab />}
      </div>
    </div>
  )
}
