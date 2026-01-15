"use client"

import React from "react"
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
import { SimpleDatePicker } from "@/components/Shared/DateSelect/SimpleDatePicker"
import DailyTipPreview from "@/components/DailyTips/DailyTipPreview"

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
  addDailyTip,
  isLoading
}: {
  translations: translationsTypes
  onClose: () => void
  token: string
  userName: string
  addDailyTip: () => void
  isLoading: boolean
}): JSX.Element {
  const {
    activeTab,
    setActiveTab,
    publishDate,
    setPublishDate,
    translationsData,
    activeLang
  } = useDailyTipStore()

  // Prepare preview data based on active tab
  const getPreviewData = (): any => {
    if (activeTab === "basicForm") {
      const data = translationsData.basicLayoutData[activeLang]
      return {
        title: data.title,
        subTitleOne: data.subTitleOne,
        subDescriptionOne: data.subDescriptionOne,
        subTitleTwo: data.subTitleTwo,
        subDescriptionTwo: data.subDescriptionTwo,
        image: data.image,
        share: data.share,
        buttonLabel: data.buttonLabel,
        concern: data.concern
      }
    }

    if (activeTab === "videoForm") {
      const data = translationsData.videoTipData[activeLang]
      return {
        title: data.title,
        subTitle: data.subTitle,
        subDescription: data.subDescription,
        videoLink: data.videoLink,
        hideVideo: data.hideVideo,
        buttonLabel: data.buttonLabel,
        concern: data.concern
      }
    }

    return {}
  }

  return (
    <div className="flex gap-6">
      {/* Left side - Form */}
      <div className="flex-1 min-w-0">
        {/* Tab Selector using Input */}
        <div className="relative z-20 flex flex-row gap-4">
          <div className="flex-1">
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
          <div className="flex-1 flex items-end mt-[-0.5rem]">
            <SimpleDatePicker
              value={publishDate}
              onChange={setPublishDate}
              label={translations.publishDate}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "basicForm" && (
            <BasicLayoutTab
              translations={translations}
              onClose={onClose}
              addDailyTip={addDailyTip}
              userName={userName}
              isLoading={isLoading}
            />
          )}
          {activeTab === "shopPromote" && (
            <ShopPromotionTab
              translations={translations}
              onClose={onClose}
              token={token}
              userName={userName}
              addDailyTip={addDailyTip}
              isLoading={isLoading}
            />
          )}
          {activeTab === "videoForm" && (
            <VideoTipTab
              translations={translations}
              onClose={onClose}
              addDailyTip={addDailyTip}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Right side - Preview (only for basicForm and videoForm) */}
      {(activeTab === "basicForm" || activeTab === "videoForm") && (
        <div className="w-[220px] shrink-0 pt-6">
          <DailyTipPreview type={activeTab} data={getPreviewData()} />
        </div>
      )}
    </div>
  )
}
