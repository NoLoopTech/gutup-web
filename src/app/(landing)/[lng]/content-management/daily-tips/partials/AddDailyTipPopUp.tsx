"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import VideoTipTab from "./VideoTipTab"
import BasicLayoutTab from "./BasicLayoutTab"
import ShopPromotionTab from "./ShopPromotionTab"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
          <div className="mb-4" style={{ width: "25.4rem" }}>
            <Label className="text-black mb-2 block">Layout Selection</Label>
            <Select value={activeTab} onValueChange={(val) => { setActiveTab(val as LayoutOption); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Layout Type" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((opt) => (
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
      </DialogContent>
    </Dialog>
  )
}
