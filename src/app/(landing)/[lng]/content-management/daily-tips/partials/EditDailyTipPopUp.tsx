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
import { SimpleDatePicker } from "@/components/Shared/DateSelect/SimpleDatePicker"
import { useUpdateDailyTipStore } from "@/stores/useUpdateDailyTipStore"
import { asDate, toUtcMidnightIso } from "@/lib/dateUtils"
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
  const { activeTab, setActiveTab, activeLang } = useDailyTipStore()
  const { translationsData, setUpdatedField } = useUpdateDailyTipStore()

  // Get publishDate from the correct section based on activeTab
  let publishDate: Date | null = null
  let publishDateRaw: string | undefined
  if (activeTab === "basicForm") {
    publishDateRaw = translationsData.basicLayoutData?.en?.publishDate
  } else if (activeTab === "shopPromote") {
    publishDateRaw = (
      translationsData.shopPromotionData?.en as { publishDate?: string }
    )?.publishDate
  } else if (activeTab === "videoForm") {
    publishDateRaw = (
      translationsData.videoTipData?.en as { publishDate?: string }
    )?.publishDate
  }
  publishDate = asDate(publishDateRaw)
  const handlePublishDateChange = (date: Date | null): void => {
    const isoString = date ? toUtcMidnightIso(date) : null
    // Remove publishDate from all sections first
    setUpdatedField("basicLayoutData", "en", "publishDate", undefined)
    setUpdatedField("basicLayoutData", "fr", "publishDate", undefined)
    setUpdatedField("shopPromotionData", "en", "publishDate", undefined)
    setUpdatedField("shopPromotionData", "fr", "publishDate", undefined)
    setUpdatedField("videoTipData", "en", "publishDate", undefined)
    setUpdatedField("videoTipData", "fr", "publishDate", undefined)
    // Set only for the active tab
    if (!isoString) return
    if (activeTab === "basicForm") {
      setUpdatedField("basicLayoutData", "en", "publishDate", isoString)
      setUpdatedField("basicLayoutData", "fr", "publishDate", isoString)
    } else if (activeTab === "shopPromote") {
      setUpdatedField("shopPromotionData", "en", "publishDate", isoString)
      setUpdatedField("shopPromotionData", "fr", "publishDate", isoString)
    } else if (activeTab === "videoForm") {
      setUpdatedField("videoTipData", "en", "publishDate", isoString)
      setUpdatedField("videoTipData", "fr", "publishDate", isoString)
    }
  }

  // Prepare preview data based on active tab from Update store
  const getPreviewData = (): any => {
    if (activeTab === "basicForm") {
      const data = translationsData.basicLayoutData[activeLang]
      return {
        title: data.title ?? "",
        subTitleOne: data.subTitleOne ?? "",
        subDescriptionOne: data.subDescriptionOne ?? "",
        subTitleTwo: data.subTitleTwo ?? "",
        subDescriptionTwo: data.subDescriptionTwo ?? "",
        image: data.image ?? "",
        share: data.share ?? false,
        buttonLabel: data.buttonLabel ?? "",
        concern: data.concern ?? []
      }
    }

    if (activeTab === "videoForm") {
      const data = translationsData.videoTipData[activeLang]
      return {
        title: data.title ?? "",
        subTitle: data.subTitle ?? "",
        subDescription: data.subDescription ?? "",
        videoLink: data.videoLink ?? "",
        hideVideo: data.hideVideo ?? false,
        buttonLabel: data.buttonLabel ?? "",
        concern: data.concern ?? []
      }
    }

    if (activeTab === "shopPromote") {
      const data = translationsData.shopPromotionData[activeLang]
      return {
        title: data.shopName ?? "",
        shopName: data.shopName ?? "",
        shopLocation: data.shopLocation ?? "",
        subDescription: data.subDescription ?? "",
        image: data.image ?? "",
        buttonLabel: "",
        concern: data.reason ?? []
      }
    }

    return {}
  }

  return (
    <div className="flex gap-6">
      {/* Left side - Form */}
      <div className="flex-1 min-w-0">
        {/* Tab Selector and Date Picker */}
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
          <div className="flex-1 flex items-end mt-[-0.5rem]">
            <SimpleDatePicker
              value={publishDate}
              onChange={handlePublishDateChange}
              label={translations.publishDate}
            />
          </div>
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

      {/* Right side - Preview (only for basicForm and videoForm) */}
      {(activeTab === "basicForm" || activeTab === "videoForm") && (
        <div className="w-[220px] shrink-0 pt-6">
          <DailyTipPreview type={activeTab} data={getPreviewData()} />
        </div>
      )}
    </div>
  )
}
