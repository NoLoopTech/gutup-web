"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import VideoTipTab from "./VideoTipTab"
import BasicLayoutTab from "./BasicLayoutTab"
import ShopPromotionTab from "./ShopPromotionTab"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  onClose: () => void
}

// Tab option
interface TabOption {
  value: LayoutOption;
  label: string;
}

type LayoutOption = "BasicLayout" | "ShopPromotion" | "VideoTip"

const tabOptions: TabOption[] = [
  { value: "BasicLayout", label: "Basic Layout" },
  { value: "ShopPromotion", label: "Shop Promotion" },
  { value: "VideoTip", label: "Video Tip" },
]

export default function AddDailyTipPopUp({ open, onClose }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<LayoutOption>("BasicLayout")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`div::-webkit-scrollbar { width: 0px; background: transparent; }`}
          </style>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Add New Daily Tip</h2>
          </div>

          {/* Tab Selector using Input */}
          <div className="mb-4" style={{ width: "25.1rem" }}>
            <Label className="text-black mb-2 block">Layout Selection</Label>
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
            {activeTab === "BasicLayout" && <BasicLayoutTab />}
            {activeTab === "ShopPromotion" && <ShopPromotionTab />}
            {activeTab === "VideoTip" && <VideoTipTab />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
